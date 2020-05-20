export function emailValidator(text) {
    const re = /\S+@\S+\.\S+/;
    return (text.length == 0 || re.test(text)) ?
        { valid : true } : 
        { valid : false, error: 'Please input a valid email'}
}

export function passwordValidator(text) {
    return (text.length >= 8) ?
        { valid : true } :
        { valid : false, error: 'Password must be atleast 8 long'}
}

export function positiveIntValidator(text) {
    const re = /\d+/
    if (re.test(text)) {
        const num = Number.parseInt(text)
        if (num > 0) { 
            return { valid : true }
        }
    }
    return {
        valid: false,
        error: 'Calories must be a positive integer'
    }
}