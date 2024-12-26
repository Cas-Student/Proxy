import express from 'express'
import { createServer } from 'http'

export const msg = express.Router()

msg.get('*', (req, res) => {
    res.redirect('/chat')
})
