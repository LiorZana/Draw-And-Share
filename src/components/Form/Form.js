import React, { useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles((theme) => {
    const palette = theme.palette;
    return {
        root: {
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

        },
        userPrompt: {
            fontSize: '1.5em',
            lineHeight: '1em',
            '& *': {
                margin: 0
            }
        }
    }
});


const Form = ({ setMouseOnForm, loadUser, formType, handleFetch }) => {

    const classes = useStyles();
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [userPrompt, setUserPrompt] = useState({ email: '', password: '', userName: '' });
    const [shouldSubmit, setShouldSubmit] = useState(false);
    const [serverResponse, setServerResponse] = useState('');



    React.useEffect(() => {
        if (!isEmailAddress(userEmail) && userEmail.length) {
            setUserPrompt({ email: 'Not a valid email address', password: userPrompt.password, userName: userPrompt.userName })
            if (shouldSubmit) {
                setShouldSubmit(false);
            }
        }
        else if (!serverResponse) {
            setUserPrompt({ email: '', password: userPrompt.password, userName: userPrompt.userName })
        }
    }, [userEmail, userPrompt.password, userPrompt.userName, shouldSubmit, serverResponse])


    React.useEffect(() => {
        if (formType === 'register') {
            if (userName.length && userName.length < 3) {
                setUserPrompt({ email: userPrompt.email, password: userPrompt.password, userName: 'Username length has to be more than 2 characters' })
                if (shouldSubmit) {
                    setShouldSubmit(false);
                }
            } else if (!serverResponse) {
                setUserPrompt({ email: userPrompt.email, password: userPrompt.password, userName: '' })
            }
        }

    }, [formType, userName, userPrompt.email, userPrompt.password, shouldSubmit, serverResponse])


    React.useEffect(() => {
        if (formType === 'register') {
            if (userPassword.length && userPassword.length < 8) {
                setUserPrompt({ email: userPrompt.email, password: 'Password length has to be more than 8 characters', userName: userPrompt.userName })
                if (shouldSubmit) {
                    setShouldSubmit(false);
                }
            }
            else {
                setUserPrompt({ email: userPrompt.email, password: '', userName: userPrompt.userName })
            }
        }
    }, [formType, userPassword, userPrompt.email, userPrompt.userName, shouldSubmit])

    React.useEffect(() => {
        if (!shouldSubmit
            && isEmailAddress(userEmail)
            && userPassword.length >= 8
            && (formType === 'register' ? userName.length > 2 : true)) {
            setShouldSubmit(true);
        }

    }, [userEmail, userPassword, userName, shouldSubmit, formType])


    React.useEffect(() => {
        switch (serverResponse) {
            case 'emailAndUsernameTaken':
                setUserPrompt({ email: 'This email address is already in use by another user', password: '', userName: 'This user name is already in use by another user' });
                break;
            case 'emailTaken':
                setUserPrompt({ email: 'This email address is already in use by another user', password: '', userName: '' });
                break;
            case 'usernameTaken':
                setUserPrompt({ email: '', password: '', userName: 'This user name is already in use by another user' });
                break;
            case 'userNotFound':
                setUserPrompt({ email: 'No user was found with that email address', password: '', userName: '' })
                break;
            default:
                setUserPrompt({ email: '', password: '', userName: '' })
        }
    }, [serverResponse])


    const handleUsernameChange = (event) => {
        setUserName(event.target.value);
        if (serverResponse) {
            setServerResponse('')
        }
    }

    const handleEmailChange = (event) => {
        setUserEmail(event.target.value);
        if (serverResponse) {
            setServerResponse('')
        }
    }

    const handlePasswordChange = (event) => {
        setUserPassword(event.target.value);
    }

    const onSubmitSignin = async () => {
        try {
            const response = await handleFetch('signin', 'post', { email: userEmail, password: userPassword })
            if (response[0].email) {
                loadUser(response[0]);
            } else {
                setServerResponse(response)
            }
        } catch (error) {
            setUserPrompt({ ...userPrompt, userName: 'Login error' })
        }

    }

    const onSubmitRegister = async () => {
        try {
            const response = await handleFetch('register', 'post', { userName: userName, email: userEmail, password: userPassword })
            if (response.email) {
                loadUser(response);
            } else {
                setServerResponse(response)
            }
        } catch (error) {
            setUserPrompt({ ...userPrompt, userName: 'Register error' })
        }

    }

    const handleSubmit = () => {
        if (formType === 'register') {
            onSubmitRegister();
        } else {
            onSubmitSignin();
        }
    }

    const isEmailAddress = (input) => {
        const regex = /^(?:[a-zA-Z0-9])([-_0-9a-zA-Z+]+(\.[-_0-9a-zA-Z+]+)*|^)@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}\.?$/g;
        return regex.test(input)
    }


    return (
        <Container onMouseEnter={() => setMouseOnForm(true)} onMouseLeave={() => setMouseOnForm(false)} classes={{ root: classes.root }} maxWidth='lg'>
            <h1 className={classes.header}>{formType === 'register' ? 'Register' : 'Sign in'}</h1>
            {
                userPrompt ?
                    <div className={classes.userPrompt}>
                        <h6>{userPrompt.email}</h6>
                        <h6>{userPrompt.password}</h6>
                        <h6>{userPrompt.userName}</h6>
                    </div>
                    : false
            }

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
            <Button disabled={!shouldSubmit} onClick={handleSubmit} variant="contained" classes={{ root: classes.buttonRoot, label: classes.buttonLabel }}>Submit</Button>
        </Container>

    )
}

export default Form;