import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectdb from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'

dotenv.config()

const app = express()

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // or your frontend URL
    credentials: true
}))

// Body parser middleware - IMPORTANT: These must come before routes
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Debug middleware - Add more detailed logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    next();
});

// Routes
app.use('/api/users', userRouter)
app.use('/api/image', imageRouter)

// Test route to verify server is working
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working', body: req.body });
});

// Home route
app.get('/', (req, res) => res.send('API is running'))

// Connect to MongoDB
const PORT = process.env.PORT || 5000


const startServer = async () => {
    try {
        await connectdb()
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
            console.log('MongoDB connected')
        })
    } catch (error) {
        console.error('Error starting server:', error)
        process.exit(1)
    }
}

startServer()