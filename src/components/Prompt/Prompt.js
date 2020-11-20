import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: '20%',
        height: '25%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: theme.palette.primary.main
    },
    buttonDiv: {
        display: 'flex',
        width: '80%',
        justifyContent: 'space-around'
    }
}))
const Prompt = ({ text = 'no text here yet', buttons = [{ text: 'noText', result: false }], handleClick, setMouseOnPrompt, promptType='' }) => {
    const classes = useStyles();


    return (
        <Container onMouseEnter={() => setMouseOnPrompt(true)} onMouseLeave={() => setMouseOnPrompt(false)} classes={{ root: classes.root }}>
            <p>{text}</p>
            <div className={classes.buttonDiv}>
                {buttons.map((button, i) => {
                    return <Button key={i} onClick={() => handleClick(button.result, promptType)} variant='contained'>{button.text}</Button>
                })}
            </div>


        </Container>
    )
}

export default Prompt;