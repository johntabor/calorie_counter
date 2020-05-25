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
import CheckIcon from '@material-ui/icons/Check';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    grid: {
        justifyContent: 'center',
    },
    paper: {
        height: '60vh',
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
        borderRadius: '10%',
        flexGrow: '2'
    }
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Register = (props) => {
    const classes = useStyles();
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
            daily_caloric_goal: 0
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
            password: Yup.string()
                .required('Required'),
            confirmPassword: Yup.string()
                .required('Required')
                .test('Passwords Match', 'Passwords must match', (value) => {
                    return formik.values.password === value
                }),
            daily_caloric_goal: Yup.number()
                .positive('Must be more than 0')
                .lessThan(10000, 'You arent Michael Phelps')
                .required('Required')
                .integer('Must be an integer')
        }),
        onSubmit: (values, actions) => {
            const url = 'http://localhost:5000/register'
            const req = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                    daily_caloric_goal: values.daily_caloric_goal,
                })
            }

            fetch(url, req)
                .then(res => res.json())
                .then(data => {
                    if (data.status == 1) {
                        props.history.push('/login')
                    } else {
                        actions.setSubmitting(false)
                        actions.setStatus({ error: data.error})
                    }
                });
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
                                    Sign Up
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
                            <TextField
                                className={classes.field}
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                label='Confirm Password'
                                {...formik.getFieldProps('confirmPassword')}
                                error={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                helperText={
                                    (formik.touched.confirmPassword && formik.errors.confirmPassword) ?
                                        formik.errors.confirmPassword : null
                                }
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField 
                                className={classes.field}
                                id='daily_caloric_goal'
                                name='daily_caloric_goal'
                                type='tel' 
                                label='Daily Calorie Goal'
                                {...formik.getFieldProps('daily_caloric_goal')}
                                error={formik.touched.daily_caloric_goal && formik.errors.daily_caloric_goal}
                                helperText={
                                    (formik.touched.daily_caloric_goal && formik.errors.daily_caloric_goal) ?
                                        formik.errors.daily_caloric_goal : null
                                }
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CheckIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                className={classes.button}
                                type='submit'
                                variant='contained'
                                color='primary'>
                                Register
                            </Button>
                        </form>
                    </Paper>
                    <Snackbar open={formik.status && formik.status.error}
                        autoHideDuration={6000} onClose={() => formik.setStatus({})}>
                        <Alert severity='error' onClose={() => formik.setStatus({})}>
                            { formik.status && formik.status.error }
                        </Alert>
                    </Snackbar>
                </Grid>
            </Grid>
        </div>
    )
}

export default Register