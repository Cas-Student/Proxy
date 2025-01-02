const socket = io({
    query: {
        room: new URLSearchParams(window.location.search).get('room') || 'public'
    }
})

let msg = []
socket.on('Server.msg', function(data) {
    const text = `[${data.user}] ${data.message}`
    const el = document.createElement('li')
    const messages = document.getElementById('messages')
    el.innerText = text
    el.className = 'message'
    if (msg.length < 5) {
        console.log(msg.length)
        msg.push(text)
        messages.appendChild(el)
    } else {
        msg.shift()
        msg.push(text)
        messages.innerHTML = ''
        for (let m in msg) {
            let l = document.createElement('li')
            l.innerText = m
            l.className = 'message'
            messages.appendChild(l)
        }
    }
})

document.getElementById('sender').addEventListener('click', () => {
    const text = document.getElementById('send').value
    if (text !== '') {
        socket.emit('Client.msg', JSON.stringify({ message: text, user: localStorage.getItem('fname') }))
    }
    document.getElementById('send').value = ''
})