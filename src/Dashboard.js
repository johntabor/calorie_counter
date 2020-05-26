import React, { Component } from 'react';
import * as moment from 'moment-timezone';
import './Dashboard.css';

import EntryRow from './EntryRow';
import DatePicker from './DatePicker';
import ProgressBar from './ProgressBar';
import Auth from './auth';

import {
    Button, List, Divider, ButtonGroup, Grid
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const styles = theme => ({
    grid: {
        justifyContent: 'center',
    },

    btn: {
        height: 10
    },
    list: {
        width: '100%',
        overflow: 'auto',
        maxHeight: 200,
        backgroundColor: theme.palette.background.paper
    },
    picker: {
        marginBottom: 20
    },
    pickerToolbar: {
        display: 'flex',
        justifyContent: 'space-around',
        '& Button': {
            backgroundColor: 'white'
        }
    },
    addFoodButton: {
        marginTop: 10,
        width: '100%'
    },
    divider: {
        marginBottom: '10px'
    },
    divider2: {
        marginBottom: '20px'
    }
})


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.changeDate = this.changeDate.bind(this);
        this.removeFood = this.removeFood.bind(this);
        let date = moment().format('YYYY-MM-DD')
        if (this.props.location.state && this.props.location.state.date) {
            date = this.props.location.state.date
        }
        this.state = {
            caloriesConsumed: 0,
            entry: {
                calorieGoal: 0,
                foods: []
            },
            date: date,
        }
    }

    componentDidMount() {
        this.fetchEntry()
            .then(entry => {
                this.processEntry(entry)
            })
    }

    changeDate(offset) {
        const newDate = moment(this.state.date, "YYYY-MM-DD")
            .add(offset, 'day').format("YYYY-MM-DD")
        this.setState({ date: newDate }, () => {
            this.fetchEntry()
                .then(entry => this.processEntry(entry))
        })
    }

    removeFood(id) {
        console.log("in remove food with id: ", id)
        const url = process.env.REACT_APP_SERVER_URL + '/deleteFoodFromEntry'
        const req = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Auth.getToken()
            },
            body: JSON.stringify({
                id: id
            })
        }

        fetch(url, req)
            .then(() => {
            const updatedFoods = this.state.entry.foods.filter(food => food.id !== id)
            const caloriesConsumed = updatedFoods.reduce((total, food) => {
                return total + food.calories
            }, 0)
            this.setState({
                entry: { ...this.state.entry, foods: updatedFoods },
                caloriesConsumed: caloriesConsumed
            })
        })
    }

    processEntry = (entry) => {
        const caloriesConsumed = entry.foods.reduce((total, food) => {
            return total + food.calories
        }, 0)
        this.setState({
            food: entry.foods,
            calorieGoal: entry.calorieGoal,
            caloriesConsumed: caloriesConsumed,
            entry: entry
        })
    }

    async fetchEntry() {
        const url = process.env.REACT_APP_SERVER_URL + '/getEntry'
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Auth.getToken()
            },
            body: JSON.stringify({
                date: this.state.date
            })
        })
        return res.json()
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Grid container className={classes.grid}>
                    <Grid item xs={12} sm={10} md={8} lg={6} xl={6}>
                        <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                            <Button>Calorie Counter</Button>
                            <Button onClick={() => {
                                this.props.history.push('/settings')
                            }}>Settings<SettingsIcon /></Button>
                            <Button onClick={
                                () => {
                                    Auth.logout(() => {
                                        this.props.history.push('/')
                                    })
                                }
                            }>Logout<ExitToAppIcon /></Button>
                        </ButtonGroup>
                        <Divider className={classes.divider2} />
                        <DatePicker changeDate={this.changeDate} date={this.state.date} />
                        <Divider className={classes.divider} />
                        <ProgressBar goal={this.state.entry.calorieGoal} consumed={this.state.caloriesConsumed} />
                        <List dense className={classes.list}>
                            {this.state.entry.foods.map(item => 
                                <EntryRow 
                                    onClick={() => this.props.history.push({
                                        pathname: '/food',
                                        state: {
                                            foodId: item.id
                                        }
                                    })} 
                                    removeFood={this.removeFood} 
                                    item={item} 
                                />)
                            }
                        </List>
                        <Button className={classes.addFoodButton}
                            onClick={() => this.props.history.push({
                                pathname: '/add',
                                state: { date: this.state.date }
                            })}
                            variant='outlined' color='primary'>Add Food</Button>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
}


export default withStyles(styles)(Dashboard);
