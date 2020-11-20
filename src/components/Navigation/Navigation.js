import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
    const palette = theme.palette;
    const secondaryLight = theme.palette.secondary.light;
    const backgroundRGB = secondaryLight.slice(4, secondaryLight.length - 1);
    return {
        root: {
            display: 'flex',
            overflow: 'visible',
            backgroundColor: `rgba(${backgroundRGB}, 0.8)`,
            color: palette.teriary.main,
            boxShadow: '0px 1px 10px 1px grey',
            position: 'relative',
            width: '100%',
            top: 0,
            left: 0,
            right: 0,


            '&:hover': {
                backgroundColor: `rgba(${backgroundRGB}, 1)`
            },
            '& > *': {
                margin: `0em 2em 0em 2em`,
                fontWeight: 600,
                fontSize: theme.typography.body1.fontSize,
                [theme.breakpoints.down('xs')]: {
                    fontSize: (theme.typography.body1.fontSize/1.5),
                  },

            },
            '& nav:hover': {
                color: palette.quaternary.main,
                cursor: 'pointer'
            },
            '& nav:active': {
                color: palette.teriary.light
            }
        },
        pushLink: {
            display: 'flex',
            flexDirection: 'row',
            marginLeft: `auto`,
            '& >*': {
                marginLeft: '2em',
            }
        },
    }
}
);

const Navigation = ({ handleToggleForm, handleRouteChange, isSignedIn, handleSignOut }) => {
    const classes = useStyles();

    const handleClick = (formType) => {
        if (formType === 'signin') {
            if (!isSignedIn) {
                handleToggleForm(true, formType)
            } else {
                handleSignOut();
            }
        } else {
            handleToggleForm(true, formType)
        }

    }



    return (
        <div className={classes.root}>
            <nav>
                <p onClick={() => handleRouteChange('home')}>Home</p>
            </nav>
            <nav>
                <p onClick={() => handleRouteChange('canvas')}>Canvas</p>
            </nav>
            <nav>
                <p onClick={() => handleRouteChange('gallery')}>{isSignedIn ? 'Gallery' : ''}</p>
            </nav>
            <div className={classes.pushLink}>
                <nav>
                    <p onClick={() => handleClick('signin')}>{isSignedIn ? 'Sign out' : 'Sign in'}</p>
                </nav>
                <nav>
                    <p onClick={() => handleClick('register')}>{isSignedIn ? '' : 'Register'}</p>
                </nav>

            </div>

        </div>
    )
}

export default Navigation;