import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        lineHeight: '0.5rem',
        boxShadow: '0 -1px 20px 2px black',
        backgroundColor: theme.palette.secondary.dark,
        color: 'white',
        fontSize: '1.2em',
        position: 'relative',
        left: 0,
        bottom: 0,
        overflow: 'hidden',
        width: '100%'
    }
  }));

const Footer = () => {
    const classes = useStyles();
    return (
    <div className={classes.root}>
        <p>Made by Lior Zana</p>
    </div>)

}

export default Footer;