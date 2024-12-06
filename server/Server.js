import express from 'express'
import cors from 'cors'
import 'dotenv/config'

const PORT = process.env.PORT || 4000
const app = express()


app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send('API is running'))

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))