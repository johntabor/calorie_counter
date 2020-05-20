import React from 'react';
import {
    makeStyles,
    ButtonGroup,
    Button,
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';


const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: 10,
        display: 'flex',
        justifyContent: 'center'
    },

}));

const DatePicker = (props) => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <ButtonGroup className={classes.buttonGroup} variant="contained" color="primary" aria-label="contained primary button group">
                <Button onClick={() => props.changeDate(-1)}><ChevronLeftIcon/></Button>
                <Button>{props.date}</Button>
                <Button onClick={() => props.changeDate(1)}><ChevronRightIcon/></Button>
            </ButtonGroup>
        </div>
    );
}

export default DatePicker;
