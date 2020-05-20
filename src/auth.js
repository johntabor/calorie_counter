import Cookies from 'js-cookie';

class Auth {
    login(id, cb) {
        Cookies.set('user_id', id)
        cb()
    }

    logout(cb) {
        Cookies.remove('user_id')
        cb()
    }

    isAuthenticated() {
        return Cookies.get('user_id') != undefined ? true : false
    }

    getUserId() {
        return Cookies.get('user_id')
    }
}   

export default new Auth()