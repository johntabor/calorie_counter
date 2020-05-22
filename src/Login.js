import React, { Component } from 'react';
import Auth from './auth';

import {
    TextField,
    Paper,
    Container,
    Button,
    InputAdornment,
} from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import EmailIcon from '@material-ui/icons/Email';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ValidatedTextField from './ValidatedTextField'
import { 
    emailValidator, 
    passwordValidator,
} from './utils/validators';

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
    },
    login: {
        marginTop: '10vh',
        height: '50vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    accountIcon: {
        margin: '0 auto'
    },
    field: {
        width: '75%',
        margin: '0 auto'
    },
    button: {
        width: '75%',
        margin: '0 auto',
    }
})

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }

    onEmailChange = (event) => {
        this.setState({ email: event.target.value })
    }

    onPasswordChange = (event) => {
        this.setState({ password: event.target.value })
    }

    onSubmit = (event) => {
        //event.preventDefault();
        const url = process.env.SERVER_URL + '/login'
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
            .then(res => res.json())
            .then(data => {
                const id = data.id;
                if (id != -1) {
                    Auth.login(id, () => {
                        this.props.history.push("/")
                    })
                }
            })
    }

    render() {
        const { classes } = this.props;
        return (
            <Container className={classes.root} maxWidth='xs'>
                <Paper className={classes.login} elevation={3}>
                    <AccountCircle className={classes.accountIcon} fontSize='large' />
                    <ValidatedTextField className={classes.field} label='Email' 
                        onChange={this.onEmailChange} validator={emailValidator}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField className={classes.field} label='Password'
                        onChange={this.onPasswordChange} type='password'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button onClick={this.onSubmit} className={classes.button} variant='outlined' color='primary'>Sign in</Button>
                </Paper>
            </Container>
        );
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Login);
