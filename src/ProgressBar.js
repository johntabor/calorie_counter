import React from 'react';
import {
    makeStyles,
    GridList,
    GridListTile,
    LinearProgress
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    grid: {
        width: '100%',
    },
    gridTile: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        maxHeight: 50
    },
    gridTileDiv: {
        textAlign: 'center',
        '& p': {
            margin: 0
        },
    },
}));

const ProgressBar = (props) => {
    const classes = useStyles();
    const { goal, consumed } = props;
    const remaining = goal - consumed;
    const percentage = Math.min(100, (consumed / goal) * 100)
    return (
        <div>
            <GridList className={classes.grid} cols={11}>
                <GridListTile className={classes.gridTile} cols='3'>
                    <div className={classes.gridTileDiv}>
                        <p>{ goal }</p>
                        <p><small>goal</small></p>
                    </div>
                </GridListTile>
                <GridListTile className={classes.gridTile} cols='1'>
                    <div className={classes.gridTileDiv}>
                        <p>-</p>
                    </div>
                </GridListTile>
                <GridListTile className={classes.gridTile} cols='3'>
                    <div className={classes.gridTileDiv}>
                        <p>{ consumed }</p>
                        <p><small>food</small></p>
                    </div>

                </GridListTile>
                <GridListTile className={classes.gridTile} cols='1'>
                    <div className={classes.gridTileDiv}>
                        <p>=</p>
                    </div>
                </GridListTile>
                <GridListTile className={classes.gridTile} cols='3'>
                    <div className={classes.gridTileDiv}>
                        <p>{ remaining }</p>
                        <p><small>remaining</small></p>
                    </div>
                </GridListTile>
            </GridList>
            <LinearProgress variant='determinate' value={percentage}></LinearProgress>
        </div>
    );
}

export default ProgressBar;
