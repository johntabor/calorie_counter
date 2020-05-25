import React, { Component } from 'react';
import {
  TextField,
  Container,
  Paper,
  Button,
} from '@material-ui/core';
import Auth from './auth';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import * as moment from 'moment-timezone';


const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  content: {
    marginTop: '10vh',
    height: '75vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  recommendationList: {
    width: '75%',
    margin: '0 auto',
    overflow: 'auto',
    maxHeight: 50,
    backgroundColor: theme.palette.background.paper
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


class Settings extends Component {
  constructor() {
    super();
    this.state = {
      daily_caloric_goal: -1
    }
  }

  componentDidMount() {
      fetch('http://localhost:5000/getUser', {
          method: 'POST',
          headers: { 'Content-Type' : 'application/json' },
          body: JSON.stringify({
            user_id: Auth.getUserId()
          })
      })
      .then(res => res.json())
      .then(data => this.setState({ daily_caloric_goal: data.daily_caloric_goal }))
  }

  onDailyCaloricGoalChange = (event) => {
      this.setState({ daily_caloric_goal: event.target.value })
  }

  onSubmit = (event) => {
    event.preventDefault();
    console.log('user id : ', Auth.getUserId())
    console.log(this.state)
    fetch('http://localhost:5000/changeCalorieGoal', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({
            user_id: Auth.getUserId(),
            daily_caloric_goal: this.state.daily_caloric_goal,
            date: moment().format('YYYY-MM-DD')
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log('response: ', data)
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <Container className={classes.root} maxWidth='xs'>
        <Paper className={classes.content} elevation={3}>
          <TextField className={classes.field} onChange={this.onDailyCaloricGoalChange} 
            label='Daily caloric goal' value={this.state.daily_caloric_goal} />
          <Button onClick={this.onSubmit} className={classes.button} variant='outlined' color='primary'>Save Settings</Button>
        </Paper>
      </Container>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Settings);