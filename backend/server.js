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
  name: { type: String, required: true },
  savedPosts: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    default: []
  }
})

const User = mongoose.model('User', userSchema)

// Post Model
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likedBy: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: []
  },
  comments: {
    type: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }],
    default: []
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
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
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const posts = await Post.find({ author: req.userId }).sort({ createdAt: -1 })
    const savedPosts = await Post.find({ _id: { $in: user.savedPosts } })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
    const likedPosts = await Post.find({ likedBy: req.userId })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
    res.json({ user, posts, savedPosts, likedPosts })
  } catch {
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
  } catch {
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
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post id' })
    }

    const post = await Post.findById(id)
      .populate('author', 'name email')
      .populate('comments.user', 'name')
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    res.json(post)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

app.post('/api/posts/:id/like', auth, async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post id' })
    }

    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const alreadyLiked = post.likedBy.some((likedUserId) => likedUserId.toString() === req.userId)
    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter((likedUserId) => likedUserId.toString() !== req.userId)
      await post.save()
      return res.json({ liked: false, likesCount: post.likedBy.length })
    }

    post.likedBy.push(req.userId)
    await post.save()
    res.json({ liked: true, likesCount: post.likedBy.length })
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

app.post('/api/posts/:id/comments', auth, async (req, res) => {
  try {
    const { id } = req.params
    const { content } = req.body
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post id' })
    }
    if (!content?.trim()) {
      return res.status(400).json({ message: 'Comment content is required' })
    }

    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    post.comments.push({ user: req.userId, content: content.trim() })
    await post.save()

    const updatedPost = await Post.findById(id).populate('comments.user', 'name')
    const latestComment = updatedPost.comments[updatedPost.comments.length - 1]
    res.status(201).json(latestComment)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

app.put('/api/posts/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const { title, content, category } = req.body
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post id' })
    }

    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only update your own posts' })
    }
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: 'Title and content are required' })
    }

    post.title = title.trim()
    post.content = content.trim()
    post.category = category?.trim() || ''
    post.updatedAt = new Date()
    await post.save()

    res.json(post)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

app.delete('/api/posts/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post id' })
    }

    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }
    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only delete your own posts' })
    }

    await Post.deleteOne({ _id: id })
    await User.updateMany({}, { $pull: { savedPosts: post._id } })
    res.json({ message: 'Post deleted successfully' })
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

app.post('/api/posts/:id/save', auth, async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid post id' })
    }

    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isAlreadySaved = user.savedPosts.some((savedPostId) => savedPostId.toString() === id)
    if (isAlreadySaved) {
      user.savedPosts = user.savedPosts.filter((savedPostId) => savedPostId.toString() !== id)
      await user.save()
      return res.json({ saved: false, message: 'Post removed from saved posts' })
    }

    user.savedPosts.push(post._id)
    await user.save()
    res.json({ saved: true, message: 'Post saved successfully' })
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/users/me/saved-posts', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('savedPosts')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const savedPosts = await Post.find({ _id: { $in: user.savedPosts } })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
    res.json(savedPosts)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/users/me/liked-posts', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('_id')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const likedPosts = await Post.find({ likedBy: req.userId })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
    res.json(likedPosts)
  } catch {
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
