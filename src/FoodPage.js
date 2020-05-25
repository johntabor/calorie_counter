import React, { Component } from 'react'
import Auth from './auth'

import {
    Divider,
    Grid,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Paper
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Pie } from 'react-chartjs-2'

const styles = theme => ({
    grid: {
        justifyContent: 'center',
    },
    divider: {
        margin: '10px 0'
    }
})

class FoodPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            foodId: props.location.state.foodId,
            food: {}
        }
    }

    componentDidMount() {
        const url = 'http://localhost:5000/getFood'
        const req = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Auth.getToken()
            },
            body: JSON.stringify({
                foodId: this.state.foodId
            })
        }

        fetch(url, req)
            .then(res => res.json())
            .then(data => {
                const food = data[0]
                console.log("FOOD DATA: ", data)
                this.setState({ food: food })
            })
    }

    createChartData() {
        if (this.state.food.fat && 
            this.state.food.carbs && 
            this.state.food.protein) {
                const total = this.state.food.fat * 9 + 
                    this.state.food.carbs * 4 + this.state.food.protein * 4
                return [
                    (this.state.food.fat * 9) / total,
                    (this.state.food.carbs * 4) / total,
                    (this.state.food.protein * 4) / total
                ]
        }
        return []
    }

    render() {
        const { classes } = this.props
        const chartData = {
            labels: ['Fat', 'Carbs', 'Protein'],
            datasets: [{
                data: this.createChartData(),
                backgroundColor: ['red', 'blue', 'orange']
            }]
        }
        return (
            <Grid container className={classes.grid}>
                <Grid item xs={12} sm={10} md={8} lg={6} xl={6}>
                    <Typography variant="h3" color='primary'>
                        {this.state.food.name}
                    </Typography>
                    <Divider className={classes.divider} />
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="right">Calories</TableCell>
                                    <TableCell align='right'>Unit</TableCell>
                                    <TableCell align='right'>Quantity</TableCell>
                                    <TableCell align="right">Fat&nbsp;(g)</TableCell>
                                    <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                                    <TableCell align="right">Protein&nbsp;(g)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell align='right'>{this.state.food.calories}</TableCell>
                                    <TableCell align='right'>{this.state.food.unit}</TableCell>
                                    <TableCell align='right'>{this.state.food.number}</TableCell>
                                    <TableCell align='right'>{
                                        (this.state.food.fat) ? this.state.food.fat : 'N/A'
                                    }</TableCell>
                                    <TableCell align='right'>{
                                        (this.state.food.carbs) ? this.state.food.carbs : 'N/A'
                                    }</TableCell>
                                    <TableCell align='right'>{
                                        (this.state.food.protein) ? this.state.food.protein : 'N/A'
                                    }</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    { (this.state.food.fat && this.state.food.carbs && this.state.food.protein) ?
                        <Pie data={chartData} />  : ''
                    }
                </Grid>
            </Grid>
        )
    }
}

FoodPage.propTypes = {
    classes: PropTypes.object.isRequired,
}


export default withStyles(styles)(FoodPage);
