import express from 'express'

export const msg = express.Router()

msg.get('*', (req, res) => {
    res.redirect('/chat')
})

export function msgSocket(io, callback) {
    //Unlimited amount of users
    io.setMaxListeners(0)
    io.on('connection', (socket) => {
        console.log('Connected to: ' + socket.id)
        socket.on('Client.msg', (data) => {
            data = JSON.parse(data)
            console.log(`${socket.id} as ${data.user}: ${data.message}`)
            io.emit('Server.msg', { message: data.message, user: data.user })
        })
        socket.on('disconnect', () => { console.log('Disconnected from: ' + socket.id) })
        if (callback) callback(socket)
    })
}
