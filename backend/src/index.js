// dependecies
const express = require('express')
require('dotenv').config()
const cors = require('cors')

// local imports
const connectDb = require('./db/connect')
const router = require('./routes/item')
const authRouter = require('./routes/user')


const app = express()

app.use(express.json())
app.use(cors())

// testing 
// app.get('/', (req, res) => {
//   res.json({ msg: 'i am alive!' })
// })

app.use('/items', router) 
app.use('/auth', authRouter)

const port = process.env.PORT || 3000
const run = async () => {
  await connectDb(process.env.MONGO_URI)
  app.listen(port, () => {
    console.log(`server live on ${port}`)
  })
}

run()
