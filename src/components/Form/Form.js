import React, { useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) => {
    const palette = theme.palette;
    return {
        root: {
            border: '1px solid black',
            color: palette.secondary.dark,
            background: palette.primary.main,
            borderRadius: '5px',
            boxShadow: theme.shadows[10],
            textAlign: 'center',
            padding: 0,
            width: '30em',
            marginBottom: '4em',
            paddingBottom: '4em',
        },
        header: {
            marginBottom: '1em',
            color: palette.teriary.main,
            marginTop: '1.5em',
            textTransform: 'capitalize'
        },
        input: {
            marginLeft: 'auto',
            marginRight: 'auto',
            '& >input': {
                height: '2.5em',
                borderRadius: '10px',
                opacity: 0.7,
                border: 'none',
                color: palette.secondary.dark,
                backgroundColor: palette.teriary.light,
                marginLeft: '1em',
                '&:focus,:active': {
                    outline: 'none',
                    opacity: 1
                }
            }
        },
        buttonRoot: {
            backgroundColor: palette.secondary.dark,
            marginTop: '3em',
            borderRadius: '10px',
            color: 'white',
            width: '80%',
            height: '3.5em',
            '&:hover': {
                backgroundColor: palette.secondary.main
            },
        },
        buttonLabel: {
            fontFamily: theme.typography.body1.fontFamily,
            padding: '10px',

        }
    }
});


const Form = ({ setMouseOnForm, loadUser, formType }) => {

    const classes = useStyles();
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [userPrompt, setUserPrompt] = useState('');

    React.useEffect(() => {
        if (formType === 'signin') {
            setUserPrompt('')
        }
    }, [userPassword, userEmail, formType])


    const handleUsernameChange = (event) => {
        setUserName(event.target.value);
    }

    const handleEmailChange = (event) => {
        setUserEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setUserPassword(event.target.value);
    }

    const onSubmitSignin = async () => {
        try {
            const response = await fetch('https://drawandshare-api.herokuapp.com/signin', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userEmail,
                    password: userPassword
                })
            })
            const data = (await response).json();
            const user = await data;
            if (user[0].email) {
                loadUser(user[0]);
            } else {
                setUserPrompt('Incorrect username or password')
            }
        } catch (error) {
            console.log('fetch error', error)
        }

    }

    const onSubmitRegister = async () => {
        const response = await fetch('https://drawandshare-api.herokuapp.com/register', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userName: userName,
                email: userEmail,
                password: userPassword
            })
        })
        const data = (await response).json();
        const user = await data;
        if (user.email) {
            loadUser(user);
        } else {
            console.log(user)
        }
    }

    const handleSubmit = () => {
        if (formType === 'register') {
            onSubmitRegister();
        } else {
            onSubmitSignin();
        }
    }


    return (
        <Container onMouseEnter={() => setMouseOnForm(true)} onMouseLeave={() => setMouseOnForm(false)} classes={{ root: classes.root }} maxWidth='lg'>
            <h1 className={classes.header}>{formType === 'register' ? 'Register' : 'Sign in'}</h1>
            {userPrompt ? <div>{userPrompt}</div> : false}
            {formType === 'register' ?
                <div className={classes.input}>
                    <h2>Username</h2><input onChange={handleUsernameChange} type='name' />
                </div>
                :
                false}
            <div className={classes.input}>
                <h2>Email:</h2><input onChange={handleEmailChange} type='email' />
            </div>
            <div className={classes.input}>
                <h2>Password:</h2><input onChange={handlePasswordChange} type='password' />
            </div>
            <Button onClick={handleSubmit} variant="contained" classes={{ root: classes.buttonRoot, label: classes.buttonLabel }}>Submit</Button>
        </Container>

    )
}

export default Form;