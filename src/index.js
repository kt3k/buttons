const express = require('express')
const app = express()
const db = require('./util/db')

db.on('open', () => console.log('db connected'))

require('./routes')(app)

app.get('/', (req, res) => res.send('hello world'))

app.listen(process.env.PORT || '3000')
