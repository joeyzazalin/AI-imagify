import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectdb from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'

const PORT = process.env.PORT || 4000
const app = express()
await connectdb()

app.use('/api/users', userRouter  )
app.use('/api/image', imageRouter)
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send('API is running'))

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))