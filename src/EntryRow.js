import React from 'react';
import {
    makeStyles,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
} from '@material-ui/core';
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
    const classes = useStyles();
    const item = props.item;
    const desc = item.number + " (" + item.unit + ")";

    return (
        <div>
            <ListItem button className={classes.listItem}>
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
