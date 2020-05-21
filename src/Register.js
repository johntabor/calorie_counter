
import React, { Component } from 'react';
import {
    TextField,
    Paper,
    Container,
    Button,
    InputAdornment,
    Snackbar,
} from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EmailIcon from '@material-ui/icons/Email';
import CheckIcon from '@material-ui/icons/Check';
import MuiAlert from '@material-ui/lab/Alert';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ValidatedTextField from './ValidatedTextField'
import { 
    emailValidator, 
    passwordValidator,
    positiveIntValidator,
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
    addCircleIcon: {
        margin: '0 auto'
    },
    field: {
        width: '75%',
        margin: '0 auto',
    },
    button: {
        width: '75%',
        margin: '0 auto',
    }
})

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            daily_caloric_goal: 0,
            errorSet: false,
            error: '',
        }
    }

    onEmailChange = (event) => {
        this.setState({ email: event.target.value })
    }

    onPasswordChange = (event) => {
        this.setState({ password: event.target.value })
    }

    onDailyCaloricGoalChange = (event) => {
        this.setState({ daily_caloric_goal: event.target.value })
    }

    onSubmit = (event) => {
        //event.preventDefault();
        console.log(this.state);
        const url = 'https://serene-wildwood-83229.herokuapp.com/register'
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                daily_caloric_goal: this.state.daily_caloric_goal,
            })
        }).then(res => res.json())
            .then(data => {
                if (data.status == 1) {
                    this.props.history.push('/login')
                } else {
                    this.setState({
                        errorSet: true,
                        error: data.error
                    })
                }
            });
    }

    dismissError = () => {
        this.setState({
            errorSet: false,
            error: ''
        })
    }

    render() {
        const { classes } = this.props;
        return (
            <Container className={classes.root} maxWidth='xs'>
                <Paper className={classes.login} elevation={3}>
                    <AddCircleIcon className={classes.addCircleIcon} fontSize='large' />
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
                    <ValidatedTextField className={classes.field} label='Password'
                        onChange={this.onPasswordChange} validator={passwordValidator}
                        type='password' InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <ValidatedTextField className={classes.field} label='Daily Calorie Goal'
                        onChange={this.onDailyCaloricGoalChange} validator={positiveIntValidator}
                        type='number' InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CheckIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button disabled={this.state.invalidFields} onClick={this.onSubmit} className={classes.button} variant='outlined' color='primary'>Register</Button>
                </Paper>
                <Snackbar open={this.state.errorSet} autoHideDuration={6000} onClose={this.dismissError}>
                    <Alert onClose={this.dismissError} severity="error">
                        {this.state.error}
                    </Alert>
                </Snackbar>
            </Container>
        );
    }
}

Register.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Register);
