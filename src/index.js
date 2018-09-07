const express = require('express')
const app = express()

require('./routes')(app)

app.get('/', (req, res) => res.send('hello world'))

app.listen(process.env.PORT || '3000')
