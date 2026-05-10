import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()
const port = process.env.PORT ? Number(process.env.PORT) : 3000
const mongoUrl = process.env.MONGODB_URI
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret'

app.use(cors())
app.use(express.json())

// User Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true }
})

const User = mongoose.model('User', userSchema)

// Post Model
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
})

const Post = mongoose.model('Post', postSchema)

if (mongoUrl) {
  mongoose.connect(mongoUrl).catch((error) => {
    console.error('MongoDB connection error', error)
  })
} else {
  console.warn('MONGODB_URI is not set')
}

// Middleware to verify JWT
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' })

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (e) {
    res.status(401).json({ message: 'Token is not valid' })
  }
}

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body
    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).json({ message: 'User already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ email, password: hashedPassword, name })
    await user.save()

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' })
    res.status(201).json({ token, user: { id: user._id, email, name } })
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' })
    res.json({ token, user: { id: user._id, email, name: user.name } })
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message })
  }
})

// Profile Routes
app.get('/api/users/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')
    const posts = await Post.find({ author: req.userId }).sort({ createdAt: -1 })
    res.json({ user, posts })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.put('/api/users/me', auth, async (req, res) => {
  try {
    const { name, email } = req.body
    const user = await User.findByIdAndUpdate(
      req.userId, 
      { name, email }, 
      { new: true }
    ).select('-password')
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Post Routes
app.post('/api/posts', auth, async (req, res) => {
  try {
    const { title, content, category } = req.body
    const post = new Post({
      title,
      content,
      category,
      author: req.userId
    })
    await post.save()
    res.status(201).json(post)
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' })
  }
})

app.get('/api/posts', async (_req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name').sort({ createdAt: -1 })
    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post id' })
    }

    const post = await Post.findById(id).populate('author', 'name email')
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    res.json(post)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/health', (_req, res) => {
  const isConnected = mongoose.connection.readyState === 1
  res.status(200).json({ status: 'ok', mongodb: isConnected ? 'connected' : 'disconnected' })
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
