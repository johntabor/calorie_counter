import React, { Component } from 'react'
import Auth from './auth'
import { Formik } from 'formik'
import * as Yup from 'yup'
import * as moment from 'moment-timezone';


import {
    Grid,
    TextField,
    Paper,
    Button,
    Typography,
    Snackbar,
    ButtonGroup,
    Divider
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DashboardIcon from '@material-ui/icons/Dashboard';


const styles = theme => ({
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
    formHeader: {
        display: 'flex',
        flexDirection: 'row',

    },
    fieldPair: {
        width: '100%',
        textAlign: 'left'
    },
    field: {
        width: '100%'
    }
})

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Settings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {}
        }
    }

    componentDidMount() {
        this.fetchUser()
            .then(user => this.setState({ user: user }))
    }

    async fetchUser() {
        const url = 'http://localhost:5000/getUser'
        const req = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Auth.getToken()
            },
            body: JSON.stringify({
                date: this.state.date
            })
        }
        const res = await fetch(url, req)
        return res.json()
    }

    saveSettings(values) {
        const url = 'http://localhost:5000/updateUser'
        const req = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Auth.getToken()
            },
            body: JSON.stringify({
                ...values, date: moment().format('YYYY-MM-DD')
            })
        }

        return fetch(url, req)
    }

    render() {
        const { classes } = this.props
        return (
            <Formik
                initialValues={{
                    daily_caloric_goal: '',
                }}
                validationSchema={Yup.object({
                    daily_caloric_goal: Yup.number()
                        .positive('Must be more than 0')
                        .lessThan(10000, 'You arent Michael Phelps')
                        .required('Required')
                        .integer('Must be an integer')
                })}
                onSubmit={(values, actions) => {
                    console.log('VALUES: ', values)
                    this.saveSettings(values)
                        .then(res => res.json())
                        .then(data => {
                            if (data.status === 1) {
                                actions.setStatus({ success: 'Settings saved' })
                            } else {
                                actions.setSubmitting(false)
                                actions.setStatus({ error: data.error })
                            }
                        })
                }}
            >
                {formik => (
                    <Grid container className={classes.grid}>
                        <Grid item xs={12} sm={8} md={6} lg={4} xl={4}>
                            <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                                <Button>Calorie Counter</Button>
                                <Button onClick={() => {
                                    this.props.history.push('')
                                }}>Dashboard<DashboardIcon/></Button>
                                <Button onClick={
                                    () => {
                                        Auth.logout(() => {
                                            this.props.history.push('/')
                                        })
                                    }
                                }>Logout<ExitToAppIcon /></Button>
                            </ButtonGroup>
                            <Divider className={classes.divider2} />
                            <Paper className={classes.paper} elevation={3}>
                                <form className={classes.form} onSubmit={formik.handleSubmit}>
                                    <div className={classes.formHeader}>
                                        <SettingsIcon fontSize='large'></SettingsIcon>
                                        <Typography variant="h5" color='primary'>
                                            Settings
                                        </Typography>
                                    </div>
                                    <div className={classes.fieldPair}>
                                        <Typography variant="caption" color='textPrimary'>
                                            Set your daily target calorie intake. Changes will only apply to
                                            the current day and on.
                                    </Typography>
                                        <TextField
                                            className={classes.field}
                                            id="daily_caloric_goal"
                                            name="daily_caloric_goal"
                                            type="tel"
                                            label='Daily Calorie Goal'
                                            {...formik.getFieldProps('daily_caloric_goal')}
                                            error={formik.touched.daily_caloric_goal && formik.errors.daily_caloric_goal}
                                            helperText={
                                                (formik.touched.daily_caloric_goal && formik.errors.daily_caloric_goal) ?
                                                    formik.errors.daily_caloric_goal : null
                                            }
                                        />
                                    </div>
                                    <Button
                                        className={classes.button}
                                        type='submit'
                                        variant='contained'
                                        color='primary'
                                        disabled={formik.isSubmitting}>
                                        Save Settings
                                    </Button>
                                </form>
                            </Paper>
                            <Snackbar open={formik.status && formik.status.success}
                                autoHideDuration={6000} onClose={() => formik.setStatus({})}>
                                <Alert severity='success' onClose={() => formik.setStatus({})}>
                                    {formik.status && formik.status.success}
                                </Alert>
                            </Snackbar>
                            <Snackbar open={formik.status && formik.status.error}
                                autoHideDuration={6000} onClose={() => formik.setStatus({})}>
                                <Alert severity='error' onClose={() => formik.setStatus({})}>
                                    {formik.status && formik.status.error}
                                </Alert>
                            </Snackbar>
                        </Grid>
                    </Grid>
                )}
            </Formik>
        )
    }
}

Settings.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Settings)