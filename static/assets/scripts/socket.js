const socket = io()
io.emit('Transfer', {
    user: localStorage.getItem('fname') + '@' + localStorage.getItem('lname'),
    page: location.pathname
})
