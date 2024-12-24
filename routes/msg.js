import express from 'express'
const msg = express.Router()

msg.get('*', (req, res) => {
    res.sendFile('/chat')
})

module.exports = msg
