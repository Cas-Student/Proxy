const socket = io()

socket.on('Server.msg', function(data) {
    const text = document.createTextNode(`[${data.user}] ${data.message}`)
    const el = document.createElement('li')
    const messages = document.getElementById('messages')
    el.appendChild(text)
    el.className = 'message'
    messages.appendChild(el)
})

document.getElementById('sender').addEventListener('click', () => {
    if (document.getElementById('send').value !== '') {
        socket.emit('Client.msg', JSON.stringify({ message: document.getElementById('send').value, user: localStorage.getItem('fname') }))
    }
    document.getElementById('send').value = ''
})