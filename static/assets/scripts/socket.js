window.io = io()

async() => {
    try {
        window.io().emit('Transfer', {
            user: localStorage.getItem('fname') + '@' + localStorage.getItem('lname'),
            page: location.pathname
        })
    } catch (e) {
        console.log(e)
    }
}
