const express = require('express')
const app = express()
const db = require('./util/db')
const { ok, allowMethods } = require('./util/routes')
const bodyParser = require('body-parser')

db.on('open', () => console.log('db connected'))

app.use(bodyParser.json())

app.options('/', allowMethods('GET'), ok)
app.get('/', (req, res) => {
  res.status(200).json({ message: 'ok' })
})

require('./routes')(app)

app.listen(process.env.PORT || '3000')
