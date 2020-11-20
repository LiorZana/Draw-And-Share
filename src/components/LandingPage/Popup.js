import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import backIcon from '../../Style/Icons/UndoIcon40x40.png';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.primary.light,
        position: 'fixed',
        fontSize: `2.5vh`,
        textOverflow: 'ellipsis',
        borderRadius: '5px',
        boxShadow: theme.shadows[5],

    },
    buttonRoot: {
        zIndex: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        '& *': {

        },
        '&:hover': {
        }
    },
    buttonLabel: {
        color: 'white',
        fontFamily: theme.typography.body1.fontFamily
    },
    contentArea: {
        padding: '1em',
        height: '80%',
        width: '100%',
        backgroundColor: theme.palette.primary.dark,
    },
}))


const Popup = (props) => {

    const { popupDimensions, handlePopupClose, content } = props;

    const classes = useStyles();

    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const [transitionState, setTransition] = useState('none');
    const [scaleState, setScale] = useState({ x: 1, y: 1 })
    const [boundingRect, setBoundingRect] = useState(popupDimensions.target.getBoundingClientRect())
    const contentAreaRef = React.useRef()
    const componentIsMounted = React.useRef(true)

    const { transition: propsTransition, target } = popupDimensions;
    const { top, left, width, height } = boundingRect;


    window.onresize = () => {
        if (componentIsMounted.current) {
            setBoundingRect(target.getBoundingClientRect());
        }
    }

    
    useEffect(() => {
        const { innerWidth, innerHeight } = window;
        const translateY = innerHeight / 2 - (top + height / 2);
        const translateX = innerWidth / 2 - (left + width / 2);
        setTranslate({ x: translateX, y: translateY })
        setTransition(`transform ${propsTransition}s`)
    }, [propsTransition, top, left, width, height, target])

    useEffect(() => {
        return () => {
            componentIsMounted.current = false
        }
    }, [])


    const handleGoBack = () => {
        setTranslate({ x: 0, y: 0 });
        setScale({ x: 1, y: 1 });
        setTimeout(handlePopupClose, propsTransition * 1000)
    }



    return (
        <div className={classes.root}
            style={{
                width: width,
                top: top,
                left: left,
                transform: `translate(${translate.x}px, ${translate.y}px) scale(${scaleState.x},${scaleState.y})`,
                transition: transitionState,
            }}>
            <Button
                startIcon={<img src={backIcon} alt=''></img>}
                variant='text'
                classes={{ root: classes.buttonRoot, label: classes.buttonLabel }}
                onClick={handleGoBack}>back</Button>
            <div ref={contentAreaRef} className={classes.contentArea}>
                {content}
            </div>
        </div>
    )
}


export default Popup;