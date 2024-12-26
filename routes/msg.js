import express from 'express'
import { createServer } from 'http'

export const msg = express.Router()
const server = createServer(msg)

msg.get('*', (req, res) => {
    res.redirect('/chat')
})
