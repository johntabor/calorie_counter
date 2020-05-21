import React, { Component } from 'react';
import * as moment from 'moment-timezone';
import './Dashboard.css';
import EntryRow from './EntryRow';
import DatePicker from './DatePicker';
import ProgressBar from './ProgressBar';
import Auth from './auth';
import {
    Button, List, Divider, ButtonGroup,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const styles = theme => ({
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
            food: [],
            calorieGoal: 0,
            caloriesConsumed: 0,
            date: date,
        }
    }

    changeDate(offset) {
        console.log("changing date!")
        let newDate = ""
        if (offset < 0) {
            newDate = moment(this.state.date, "YYYY-MM-DD")
                .subtract(Math.abs(offset), 'day').format('YYYY-MM-DD')
        } else {
            newDate = moment(this.state.date, "YYYY-MM-DD")
                .add(Math.abs(offset), 'day').format("YYYY-MM-DD")
        }
        this.setState({ date: newDate }, () => {
            this.fetchEntry()
                .then(data => {
                    const caloriesConsumed = data.reduce((total, food) => {
                        return total + food.calories
                    }, 0)
                    this.setState({
                        food: data,
                        caloriesConsumed: caloriesConsumed
                    })
                })
        })
    }

    removeFood(id) {
        console.log("in remove food with id: ", id)
        const url = 'https://serene-wildwood-83229.herokuapp.com/deleteFoodFromEntry'
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id
            })
        }).then(() => {
            const newFood = this.state.food.filter(food => food.id != id)
            const caloriesConsumed = newFood.reduce((total, food) => {
                return total + food.calories
            }, 0)
            this.setState({
                food: newFood,
                caloriesConsumed: caloriesConsumed
            })
        })
    }

    componentDidMount() {
        Promise.all([
            this.fetchEntry(),
            this.fetchCalorieGoal(),
        ]).then(([res1, res2]) => {
            console.log("res1 :", res1)
            console.log("res2: ", res2)
            const caloriesConsumed = res1.reduce((total, food) => {
                return total + food.calories
            }, 0)
            this.setState({
                food: res1,
                calorieGoal: res2.daily_caloric_goal,
                caloriesConsumed: caloriesConsumed
            })
        })
    }

    async fetchEntry() {
        console.log("in fetchEntry! Going to fetch date " + this.state.date)
        const url = 'https://serene-wildwood-83229.herokuapp.com/getEntry'
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: Auth.getUserId(),
                date: this.state.date
            })
        })
        return res.json()
    }

    async fetchCalorieGoal() {
        console.log("IN FETCH CALORIE GOAL")
        const url = 'https://serene-wildwood-83229.herokuapp.com/getCalorieGoal'
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: Auth.getUserId()
            })
        })
        return res.json()
    }

    render() {
        const { classes } = this.props;
        return (
            <div class="body-container">
                <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                    <Button>Calorie Counter</Button>
                    <Button>Settings<SettingsIcon /></Button>
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
                <ProgressBar goal={this.state.calorieGoal} consumed={this.state.caloriesConsumed} />
                <List dense className={classes.list}>
                    {this.state.food.map(item => <EntryRow removeFood={this.removeFood} item={item} />)}
                </List>
                <Button className={classes.addFoodButton}
                    onClick={() => this.props.history.push({
                        pathname: '/add',
                        state: { date: this.state.date }
                    })}
                    variant='outlined' color='primary'>Add Food</Button>
            </div >
        );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
}


export default withStyles(styles)(Dashboard);
