require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload');
const sequelize = require('./db');
const path = require('path')
const router = require('./routes/index')
const errorHandle = require('./middleware/errorHandle')

const PORT = process.env.PORT || 5055
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload())

app.use('/api', router)
app.use(errorHandle)

const start = async () => {
  try {
      await sequelize.authenticate()
      await sequelize.sync({alter: true})
      app.listen(PORT, () => console.log(`SERVER STARTED AT PORT ${PORT}`))
  } catch (e) {
      console.log(e)
  }
}

start()