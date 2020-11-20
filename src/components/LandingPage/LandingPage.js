import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import Cover from './cover.png';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        width: '100%',
    },
    visualDiv: {
        height: '4em',
        width: '10%',
        backgroundColor: 'rgba(255,255,255, 0)'
    },
    title: {
        fontSize: '5em',
        textAlign: 'center'
    },
    subTitle: {
    },
    paragraphWrapper: {
    },
    textArea: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: '20px',
        padding: '1em 4em 4em 4em',
        boxShadow: theme.shadows[10]
    },
    cover: {
        width: '35em',
        height: '14.4em',
        '& >img': {
            width: '100%',
            height: '100%',
            borderRadius: '0 20px 0 20px',
            boxShadow: theme.shadows[10],
        }

    }
}))
const LandingPage = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid container alignItems='center' justify='center' direction='column' spacing={0} className={classes.container}>
                <Grid item xs={12}>
                    <div className={classes.cover}><img src={Cover} alt=''></img></div>
                </Grid>
                <Grid item xs={12}>
                    <div className={classes.visualDiv}></div>
                </Grid>
                <Grid item xs={10}>
                    <div className={classes.title}>Welcome to DrawShare!</div>
                </Grid>
                <Grid item xs={10} className={classes.textArea}>
                    <h1 className={classes.subTitle}>So, what is this app?</h1>
                    <p className={classes.paragraph}>
                        This is a project I am currently working on in order to build up my portfolio.<br></br>
                        My goal in this project is to create an app in which users will be able to
                        draw and edit svg shapes and export them as an svg element or a png image.
                    </p>

                    <h1 className={classes.subTitle}>What can this app currently let you do?</h1>
                    <ul>
                        <li>You can Sign up and login!</li>
                        <li>You can draw SVG lines on a canvas!</li>
                        <li>You can select and move the lines you've drawn around on the canvas!</li>
                        <li>You can change the line color, width and opacity!</li>
                        <li>You can save your images to the database!</li>
                        <li>You can view your saved images in the gallery!</li>
                        <li>You can export the shapes you made as a {`<svg></svg>`} element, or a .png image!</li>
                    </ul>
                    <h1 className={classes.subTitle}>Currently known bugs:</h1>
                    <ul>
                        <li>Undo/Redo is currently working correctly in Draw and Select mode only.</li>
                    </ul>
                </Grid>
            </Grid>
        </div>)
}

export default LandingPage;