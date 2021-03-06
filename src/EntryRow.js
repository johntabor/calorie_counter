import React, { useState } from 'react';
import {
    makeStyles,
    ListItem,
    IconButton,
    ListItemSecondaryAction,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ConfirmationAlert from './ConfirmationAlert';


const useStyles = makeStyles((theme) => ({
    listItem: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
    },
    calorieText: {
        display: 'flex',
        justifyContent: 'center'
    }
}));

const EntryRow = (props) => {
    console.log(props)
    const classes = useStyles();
    const item = props.item;
    const desc = item.number + " (" + item.unit + ")";

    return (
        <div>
            <ListItem button className={classes.listItem} onClick={props.onClick}>
                <ListItemText primary={item.name} secondary={desc} />
                <ListItemText className={classes.calorieText} primary={item.calories} />
                <ListItemSecondaryAction>
                    <ConfirmationAlert name={item.name} onConfirm={() => props.removeFood(item.id)} />
                </ListItemSecondaryAction>
            </ListItem>
        </div>
    )
}

export default EntryRow;
