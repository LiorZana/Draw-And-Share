// import React, { useState, useEffect } from 'react';
// import { makeStyles } from "@material-ui/core/styles";
// import Button from '@material-ui/core/Button';
// import cover from './cover.png';

// const useStyles = makeStyles((theme) => ({
//     root: {
//         backgroundColor: theme.palette.primary.light,
//         position: 'fixed',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'flex-start',
//         fontSize: `2.5vh`,
//         borderRadius: '5px',
//         zIndex: 2,
//         boxShadow: theme.shadows[5],
//         '& >*': {
//             transform: 'scale(1,0.75)',
//         }
//     },
//     buttonRoot: {
//         backgroundColor: theme.palette.secondary.light,
//         top: 0,
//         borderRadius: '20px',
//         '& *': {

//         },
//         '&:hover': {
//             backgroundColor: theme.palette.secondary.main,
//         }
//     },
//     buttonLabel: {
//         color: 'white',
//     },
//     contentArea: {
//         color: theme.palette.secondary.dark,
//         width: '100%',
//         height: '20em',
//         minHeight: '20em',
//         overflow: 'visible',
//         '& >*': {
//             margin: '0 2em 0 2em'
//         }
//     },
// }))


// const Popup = ({ popupDimensions, handlePopupClose, content, handleResize }) => {

//     const classes = useStyles();

//     const [translate, setTranslate] = useState({ x: 0, y: 0 });
//     const [transitionState, setTransition] = useState('none');
//     const [scaleState, setScale] = useState({ x: 1, y: 1 })
//     const [windowDims, setWindowDims] = useState({ innerHeight: 0, innerWidth: 0 })
//     const contentAreaRef = React.useRef()
//     const newContent = React.cloneElement(content)

//     const { transition: propsTransition, scale: propsScale } = popupDimensions;
//     const { top, left, width, height } = popupDimensions;

//     window.onresize = () => {
//         handleResize()
//     }


//     useEffect(() => {
//         const translateY = window.innerHeight / 2 - (top + height / 2);
//         const translateX = window.innerWidth / 2 - (left + width / 2);
//         const propsTranslate = { x: translateX, y: translateY }
//         setTranslate({ x: propsTranslate.x, y: propsTranslate.y });
//         setTransition(`transform ${propsTransition}s`)
//         setScale({ x: propsScale.x, y: propsScale.y })
//     }, [top, left, width, height, propsTransition, propsScale])


//     const handleGoBack = () => {
//         setTranslate({ x: 0, y: 0 });
//         setScale({ x: 1, y: 1 });
//         setTimeout(handlePopupClose, propsTransition * 1000)
//     }



//     return (
//         <div className={classes.root}
//             style={{
//                 width: width,
//                 height: height,
//                 top: top,
//                 left: left,
//                 transform: `translate(${translate.x}px, ${translate.y}px) scale(${scaleState.x},${scaleState.y})`,
//                 transition: transitionState,
//             }}>
//             <Button variant='text' classes={{ root: classes.buttonRoot, label: classes.buttonLabel }} onClick={handleGoBack}>Go back</Button>
//             <div ref={contentAreaRef} className={classes.contentArea}>
//                 <div id='test'>{newContent}</div>
//             </div>
//         </div>
//     )
// }


// export default Popup;