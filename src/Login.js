import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
    makeStyles,
    Grid,
    TextField,
    Paper,
    Button,
    InputAdornment,
    Typography,
    Snackbar,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import LockIcon from '@material-ui/icons/Lock';
import EmailIcon from '@material-ui/icons/Email';
import AccountCircle from '@material-ui/icons/AccountCircle';

import Auth from './auth'


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    grid: {
        justifyContent: 'center',
    },
    paper: {
        height: '50vh',
        marginTop: '5vh',
        padding: theme.spacing(3),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    form: {
        height: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    accountIcon: {
        margin: '0 auto'
    },
    submitButton: {
        borderRadius: '10%'
    }
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const Login = (props) => {
    const classes = useStyles();
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
            password: Yup.string()
                .required('Required')
        }),
        onSubmit: (values, actions) => {
            const url = process.env.REACT_APP_SERVER_URL  + '/login'
            const req = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password
                })
            }
        
            fetch(url, req)
                .then(res => res.json())
                .then(data => {
                    if (data.status !== -1) {
                        actions.setSubmitting(false)
                        Auth.login(data.token, () => {
                            props.history.push('/')
                        })
                    } else {
                        actions.setSubmitting(false)
                        actions.setStatus({ error: data.error})
                    }
                })
        }
    })

    return (
        <div className={classes.root}>
            <Grid container className={classes.grid}>
                <Grid item xs={12} sm={8} md={6} lg={4} xl={4}>
                    <Paper className={classes.paper} elevation={3}>
                        <form className={classes.form} onSubmit={formik.handleSubmit}>
                            <div className={classes.formTitle}>
                                <AccountCircle 
                                    className={classes.accountIcon} 
                                    fontSize='large' 
                                />
                                <Typography variant="h5" color='textPrimary'>
                                    Sign In
                                </Typography>
                            </div>
                            <TextField
                                className={classes.field}
                                id="email"
                                name="email"
                                type="text"
                                label='Email'
                                {...formik.getFieldProps('email')}
                                error={formik.touched.email && formik.errors.email}
                                helperText={
                                    (formik.touched.email && formik.errors.email) ?
                                        formik.errors.email : null
                                }
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                className={classes.field}
                                id="password"
                                name="password"
                                type="password"
                                label='Password'
                                {...formik.getFieldProps('password')}
                                error={formik.touched.password && formik.errors.password}
                                helperText={
                                    (formik.touched.password && formik.errors.password) ?
                                        formik.errors.password : null
                                }
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                className={classes.button}
                                type='submit'
                                variant='contained'
                                color='primary'
                                disabled={formik.isSubmitting}>
                                Login
                            </Button>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default Login