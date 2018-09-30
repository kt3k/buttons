const express = require('express')
const app = express()
const db = require('./util/db')
const bodyParser = require('body-parser')

db.on('open', () => console.log('db connected'))

// Uncomment this line if you like to simulate slow api responses.
// app.use((req, res, next) => setTimeout(next, 3000))

app.use(bodyParser.json())

require('./routes')(app)

app.listen(process.env.PORT || '3000')
