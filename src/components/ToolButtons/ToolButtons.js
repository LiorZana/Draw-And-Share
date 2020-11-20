import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import ButtonList from './ButtonList.js';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    gridTemplateRows: '1fr 1fr',
    '& > *': {
      margin: theme.spacing(0.1),
    }
  },
  button: {
    width: '100%',
    height: '8em',
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.primary.dark,
    font: theme.typography.body1.fontFamily,
    borderRadius: '100px',
    backfaceVisibility: 'hidden',
    transform: 'tranlateZ(0)',
    transition: 'transform 0.25s ease-out',
    boxShadow: '1px 2px 5px 1px grey',
    padding: 0,
    margin: theme.spacing(0.5),
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
      transform: 'scale(1.05)',
    },
    '& img': {
      margin: '1em 0 1em 0',
      height: '40%',
      width: '40%'
    }
  },
  label: {
    fontFamily: theme.typography.button.fontFamily,
  },
  tooltip: {
    backgroundColor: theme.palette.quaternary.dark
  },
  buttonGroup: {
  }
}));

const ToolButtons = ({ handleButtonClick, isSignedIn = true }) => {
  const classes = useStyles();

  const getButtons = () => {
    const localButtons = [];
    for (let i = 0; i < 7;) {
      localButtons.push(ButtonList.slice(i, i + 3))
      i += 3;
    }
    return localButtons.map((btnGrp, i) => {
      return (
        <ButtonGroup key={i} classes={{ root: classes.buttonGroup }} variant="outlined" aria-label="contained primary button group">
          {btnGrp.map(button => {
            return(            
            <Tooltip key={button.id} classes={{ tooltipArrow: classes.tooltip }} title={button.text} arrow>
              <Button
                disabled={button?.forRegistered ? !isSignedIn : false}
                classes={{ root: classes.button, label: classes.label }}
                onClick={() => handleButtonClick(button.text)}
                id={`btn-${button.id}`}>
                <img
                  src={button.image}
                  alt={!button?.forRegistered ? button.text : isSignedIn ? button.text : 'This option is available to registered users only!'}
                  title={!button?.forRegistered ? button.text : isSignedIn ? button.text : 'This option is available to registered users only!'}
                />
              </Button>
            </Tooltip>
            )
          })}
        </ButtonGroup>
      )
    })

  }


  return (
    <div className={classes.root}>
      {getButtons()}
    </div>
  );
}

export default ToolButtons;
