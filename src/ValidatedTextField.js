import React from 'react'
import {
    TextField,
    makeStyles
} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({

})); 

const ValidatedTextField = (props) => {
    const [valid, setValid] = React.useState(true)
    const [error, setError] = React.useState('')

    const checkValid = event => {
        const val = event.target.value;
        const res = props.validator(val)
        if (res.valid) {
            setValid(true)
            setError('')
        } else {
            setValid(false)
            setError(res.error)
        }
        props.onChange(event)
    }

    const classes = useStyles();
    return (
        <TextField 
        className={props.className} error={!valid} 
        onChange={checkValid} label={props.label}
        helperText={error} InputProps={props.InputProps}
        type={props.type || 'text'}
        />
    )
}

export default ValidatedTextField;
