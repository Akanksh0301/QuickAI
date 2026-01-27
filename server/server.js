import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoutes.js'



const app = express()

await connectCloudinary()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json())
app.use(clerkMiddleware())
app.use(requireAuth())

app.get('/', (req, res) => {
  res.send('Server is Live!')
})





app.use('/api/user',  userRouter)
app.use('/api/ai', aiRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
