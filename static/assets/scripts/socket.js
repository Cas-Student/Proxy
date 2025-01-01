window.io = io()
async () => window.io.emit('Transfer', {
    user: localStorage.getItem('fname') + '@' + localStorage.getItem('lname'),
    page: location.pathname
})
