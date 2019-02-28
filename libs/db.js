const mongoose = require('mongoose')
const config = require('../config')
mongoose.Promise = global.Promise
let count = 0
let db
mongoose.set('debug', config.env === 'development')
connect()
function connect () {
  mongoose.connect(config.dbUrl,{ useNewUrlParser: true })
  db = mongoose.connection
  db.on('error', (err) => {
    console.log('mongoose err :', err)
  })
  db.once('open', () => {
    console.log(`connect ${config.dbUrl} successful!`)
  })
  db.on('disconnected', () => {
    if (count < 3) {
      connect()
      count++
    } else {
      throw new Error('数据库挂了,快去修吧。')
    }
  })
}

module.exports = connect