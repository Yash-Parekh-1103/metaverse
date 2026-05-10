import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()
const port = process.env.PORT ? Number(process.env.PORT) : 3000
const mongoUrl = process.env.MONGODB_URI

app.use(cors())
app.use(express.json())

if (mongoUrl) {
  mongoose.connect(mongoUrl).catch((error) => {
    console.error('MongoDB connection error', error)
  })
} else {
  console.warn('MONGODB_URI is not set')
}

app.get('/health', (_req, res) => {
  const isConnected = mongoose.connection.readyState === 1
  res.status(200).json({ status: 'ok', mongodb: isConnected ? 'connected' : 'disconnected' })
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
