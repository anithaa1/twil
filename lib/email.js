const nodemailer = require('nodemailer')

const email = {}

email.smtpTransport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'testingpurpose331@gmail.com',
    pass: 'wcpbevylqjxngjtc'
  },
  debug: true
})


module.exports = email
