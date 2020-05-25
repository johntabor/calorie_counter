import React, { Component } from 'react';
import Auth from './auth';
import {
  List,
  ListItem,
  ListItemText,
  TextField,
  Container,
  Paper,
  Button,
  Divider,
  FormControlLabel,
  Switch,
} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

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


class AddFood extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      unit: '',
      calories: '',
      number: '',
      recommendations: [],
      macrosOn: false,
      carbs: 0,
      protein: 0,
      fat: 0
    }
  }

  async fetchRecommendations(name) {
    const res = await fetch("http://localhost:5000/getFoodRecommendations", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name
      })
    })
    return res.json()
  }

  populateFields(food) {
    this.setState({
      name: food.name,
      unit: food.unit,
      calories: food.calories,
      number: food.number,
      recommendations: []
    })
  }

  onMacrosChange = (event) => {
    let newVal = this.state.macrosOn
    console.log('macrosOn: ', this.state.macrosOn)
    if (this.state.macrosOn === false) {
      newVal = true
    }
    this.setState({ macrosOn: event.target.checked })
  }

  onNameChange = (event) => {
    console.log("name: ", event.target.value);
    const newName = event.target.value
    if (newName.length == 0) {
      this.setState({ name: newName, recommendations: [] })
    } else {
      this.fetchRecommendations(newName)
        .then(data => this.setState({
          name: newName,
          recommendations: data
        }))
    }
  }

  onUnitChange = (event) => {
    this.setState({ unit: event.target.value })
  }

  onCaloriesChange = (event) => {
    this.setState({ calories: event.target.value })
  }

  onNumberChange = (event) => {
    this.setState({ number: event.target.value })
  }

  onSubmit = (event) => {
    event.preventDefault();
    console.log("in onSubmit");
    console.log(this.state);
    fetch('http://localhost:5000/addFoodToEntry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: this.state.name,
        unit: this.state.unit,
        calories: this.state.calories,
        number: this.state.number,
        date: this.props.location.state.date,
        user_id: Auth.getUserId()
      })
    }).then(data => {
      console.log("good")
      this.props.history.push({
        pathname: '/',
        state: {
          date: this.props.location.state.date
        }
      })
    })
  }

  render() {
    const { classes } = this.props;
    console.log("this.props.date: ", this.props.location.state.date)
    console.log("STATE: ", this.state);
    return (
      <Container className={classes.root} maxWidth='xs'>
        <Paper className={classes.content} elevation={3}>
          <TextField className={classes.field} onChange={this.onNameChange} label='Name' value={this.state.name} />
          <List dense className={classes.recommendationList}>
            {
              this.state.recommendations.map(food => {
                const desc = food.number + " (" + food.unit + ") : " + food.calories + " calories"
                return (
                  <div>
                    <ListItem button onClick={() => this.populateFields(food)}>
                      <ListItemText primary={food.name} secondary={desc} />
                    </ListItem>
                    <Divider />
                  </div>
                )
              })
            }
          </List>
          <TextField className={classes.field} onChange={this.onUnitChange} value={this.state.unit} type='text' label='Unit' />
          <TextField className={classes.field} onChange={this.onCaloriesChange} value={this.state.calories} type='number' label='Calories' />
          <TextField className={classes.field} onChange={this.onNumberChange} value={this.state.number} type='number' label='Quantity' />
          <FormControlLabel className={classes.field}
            control={
              <Switch
                name="checkedB"
                color="primary"
                onChange={this.onMacrosChange}
              />
            }
            label="Set Macros?"
          />
          <TextField className={classes.field} disabled={!this.state.macrosOn} value={this.state.carbs} type='number' label='Carbs' />
          <TextField className={classes.field} disabled={!this.state.macrosOn} value={this.state.protein} type='number' label='Protein' />
          <TextField className={classes.field} disabled={!this.state.macrosOn} value={this.state.fat} type='number' label='Fat' />

          <Button onClick={this.onSubmit} className={classes.button} variant='outlined' color='primary'>Add</Button>
        </Paper>
      </Container>
    );
  }
}

AddFood.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(AddFood);