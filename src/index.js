const express = require('express')
const app = express()
const db = require('./util/db')
const bodyParser = require('body-parser')
const morgan = require('morgan')

db.on('open', () => console.log('db connected'))
db.on('error', e => {
  if (e.name === 'MongoNetworkError') {
    console.log('Error: Unable to connect to mongodb')
    console.log('Check if you run `saku mongo` when development')
  } else {
    console.log(e)
  }
  process.exit(1)
})

// Uncomment this line if you like to simulate slow api responses.
// app.use((req, res, next) => setTimeout(next, 3000))

app.use(morgan('tiny'))
app.use(bodyParser.json())

require('./routes')(app)

app.listen(process.env.PORT || '3000')
