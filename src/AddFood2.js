import React, { Component } from 'react'
import Auth from './auth'
import { Formik } from 'formik'
import * as Yup from 'yup'
import * as moment from 'moment-timezone';
import SearchResultList from './SearchResultList'

import {
    Grid,
    TextField,
    Paper,
    Button,
    Typography,
    Snackbar,
    ButtonGroup,
    Divider,
    InputAdornment,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import SearchIcon from '@material-ui/icons/Search'

const styles = theme => ({
    grid: {
        justifyContent: 'center',
    },
    paper: {
        marginTop: '5vh',
        padding: theme.spacing(3),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        display: 'flex',
        flexDirection: 'column'
    },
    form: {
        height: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    field: {
        width: '100%',
        margin: theme.spacing(1),
        marginLeft: '0'
    },
    divider: {
        margin: '10px 0'
    },
    content: {
        flex: 1,
        overflowY: 'auto'
    },
    form: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    button: {
        margin: theme.spacing(3),
        marginLeft: '0',
        marginRight: '0',
        marginBottom: '0'
    }
})

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class AddFood extends Component {
    constructor(props) {
        super(props)
        this.onSelectResult = this.onSelectResult.bind(this)
        this.state = {
            food: {},
            searchOn: false,
            searchResults: []
        }
    }

    onSelectResult = (food) => {
        this.setState({
            food: food,
            searchOn: false,
            searchResults: []
        })
    }

    onSearchChange = (event) => {
        console.log('val ', event.target.value)
        const query = event.target.value
        if (query.length === 0) {
            this.setState({
                searchOn: false
            })
        } else {
            this.fetchSearchResults(query)
                .then(data => this.setState({
                    searchOn: true,
                    searchResults: data
                }))
        }
    }

    async fetchSearchResults(query) {
        const url = process.env.REACT_APP_SERVER_URL + '/getFoodRecommendations'
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Auth.getToken()
            },
            body: JSON.stringify({
                name: query
            })
        })
        return res.json()
    }

    render() {
        const { classes } = this.props
        return (
            <Formik
                enableReinitialize
                initialValues={{
                    name: this.state.food.name,
                    unit: this.state.food.unit,
                    calories: this.state.food.calories,
                    quantity: this.state.food.number
                }}
                validationSchema={Yup.object({

                })}
                onSubmit={(values, actions) => {
                    console.log('in onsubmit')
                    const url = process.env.REACT_APP_SERVER_URL + '/logFood'
                    const req = {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + Auth.getToken() 
                        },
                        body: JSON.stringify({
                            name: values.name,
                            unit: values.unit,
                            calories: values.calories,
                            quantity: values.quantity,
                            date: this.props.location.state.date,
                        })
                    }
                    fetch(url, req)
                        .then(data => {
                            this.props.history.push({
                                pathname: '/',
                                state: {
                                    date: this.props.location.state.date
                                }
                            })
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
                                }}>Dashboard<DashboardIcon /></Button>
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
                                <TextField
                                    type='text'
                                    placeholder='Search for a food...'
                                    fullWidth
                                    variant='outlined'
                                    size='small'
                                    onChange={this.onSearchChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Divider className={classes.divider} />
                                <div className={classes.content}>
                                    {this.state.searchOn ?
                                        <SearchResultList
                                            className={classes.searchResultList}
                                            searchResults={this.state.searchResults}
                                            selectResult={this.onSelectResult}
                                        />
                                        :
                                        <form className={classes.form} onSubmit={formik.handleSubmit}>
                                            <TextField
                                                className={classes.field}
                                                id="name"
                                                name="name"
                                                type="text"
                                                label='Name'
                                                variant='outlined'
                                                size='small'
                                                {...formik.getFieldProps('name')}
                                                error={formik.touched.name && formik.errors.name}
                                                helperText={
                                                    (formik.touched.name && formik.errors.name) ?
                                                        formik.errors.name : null
                                                }
                                            />
                                            <TextField
                                                className={classes.field}
                                                id="unit"
                                                name="unit"
                                                type="text"
                                                label='Unit'
                                                variant='outlined'
                                                size='small'
                                                {...formik.getFieldProps('unit')}
                                                error={formik.touched.unit && formik.errors.unit}
                                                helperText={
                                                    (formik.touched.unit && formik.errors.unit) ?
                                                        formik.errors.unit : null
                                                }
                                            />
                                            <TextField
                                                className={classes.field}
                                                id="calories"
                                                name="calories"
                                                type="tel"
                                                label='Calories Per Unit'
                                                variant='outlined'
                                                size='small'
                                                {...formik.getFieldProps('calories')}
                                                error={formik.touched.calories && formik.errors.calories}
                                                helperText={
                                                    (formik.touched.calories && formik.errors.calories) ?
                                                        formik.errors.calories : null
                                                }
                                            />
                                            <TextField
                                                className={classes.field}
                                                id="quantity"
                                                name="quantity"
                                                type="number"
                                                label='Quantity'
                                                variant='outlined'
                                                size='small'
                                                {...formik.getFieldProps('quantity')}
                                                error={formik.touched.quantity && formik.errors.quantity}
                                                helperText={
                                                    (formik.touched.quantity && formik.errors.quantity) ?
                                                        formik.errors.quantity : null
                                                }
                                            />
                                            <Button
                                                className={classes.button}
                                                type='submit'
                                                variant='contained'
                                                color='primary'>
                                                Add
                                            </Button>
                                        </form>
                                    }
                                </div>
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </Formik>
        )
    }
}

AddFood.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(AddFood)