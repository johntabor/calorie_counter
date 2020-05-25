class Auth {
    login(token, cb) {
        window.sessionStorage.setItem('token', token)
        cb()
    }

    logout(cb) {
        window.sessionStorage.removeItem('token')
        cb()
    }

    isAuthenticated() {
        const token = window.sessionStorage.getItem('token')
        if (!token) {
            return false
        }
        return true 
        
        /*
        if (!token) {
            return false
        }

        const url = 'http://localhost:5000/login'
        const req = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token  
            }
        }

        const data = await (await fetch(url,req)).json()
        return (data.authorized === 'true') ? true : false */
    }

    getToken() {
        return window.sessionStorage.getItem('token')
    }
}   

export default new Auth()