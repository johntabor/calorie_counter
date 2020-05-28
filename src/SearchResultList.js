import React from 'react'
import {
    makeStyles,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({

}));

const SearchResultList = (props) => {
    const classes = useStyles();
    return (
        <List dense className={classes.list}>{
            props.searchResults.map(food => {
                const desc = food.number + " (" + food.unit + ") : " + food.calories + " calories"
                return (
                    <div>
                        <ListItem button onClick={() => props.selectResult(food)}>
                            <ListItemText primary={food.name} secondary={desc} />
                        </ListItem>
                        <Divider />
                    </div>
                )
            })
        }
        </List>
    )
}

export default SearchResultList;
