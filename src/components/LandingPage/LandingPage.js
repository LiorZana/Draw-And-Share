import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import cover from './cover.png';
import canvasScrnsht from './CanvasScrsht.png';
import Popup from './Popup.js';
import PopupWrapper from '../../containers/PopupWrapper/PopupWrapper.js';
import Tooltip from '@material-ui/core/Tooltip';



const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        width: '100%',
        overflow: 'auto',
        paddingTop: '3em',
        paddingBottom: '5em',
        '& ul': {
            margin: 0
        }
    },
    container: {
        height: '100%'
    },
    link: {
        width: '100%',
        height: '50%',
        margin: '5px',
        zIndex: 0,
        '&:hover': {
            transform: 'scale(1.1,1.1)',
            zIndex: 1
        },
        '& >div': {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            textAlign: 'center',
            backgroundColor: theme.palette.primary.main,
            margin: 0,
            width: '100%',
            height: '100%',
            boxShadow: theme.shadows[10],
        }
    },
    subTitle: {
        fontSize: '3vh',
        margin: 0,
    },
    paragraph: {
        color: theme.palette.teriary.main,
    },
    logo: {
        overflow: 'hidden',
        '& >#image': {
            backgroundImage: `url(${cover})`,
            width: '100%',
            margin: 0,
            height: '25.5em',
            minHeight: '10em',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
        },
    },
    popupLogo: {
        height: '100%',
        width: '100%',
        '& >#image': {
            backgroundImage: `url(${cover})`,
            backgroundPosition: 'center',
            width: 'auto',
            height: '100%',
            minHeight: '15em',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
        }
    },
    canvasLink: {
        display: 'flex',
        width: '100%',
        height: '100%',
        '& >#image': {
            height: '14em',
            width: '100%',
            maxWidth: '100%',
            backgroundImage: `url(${canvasScrnsht})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
        }
    },
    publicUploads: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, auto)',
        columnGap: '0.3em',
        padding: '2em 2em 0 2em',
        rowGap: '0.3em',
        width: '100%',
        height: '80%',

        // [theme.breakpoints.down('xs')]: {
        //     gridTemplateColumns: 'repeat(2, auto)',
        // },
        [theme.breakpoints.down('xs')]: {
            gridTemplateColumns: 'repeat(3, auto)',
        },
        [theme.breakpoints.up('sm')]: {
            gridTemplateColumns: 'repeat(5, auto)',
        },


    },
    imagesWrapper: {
        width: '100%',
        height: '80%',
        backgroundColor: theme.palette.primary.dark,
        marginTop: '1em'
    },
    buttonLabel: {
        fontFamily: theme.typography.body1.fontFamily,

    },
    formButtonRoot: {
        width: '50%',
        backgroundColor: theme.palette.teriary.main,
        opacity: 0.7,
        '&:hover': {
            opacity: 1,
            backgroundColor: theme.palette.teriary.main,
        },
    },
    tryMeRoot: {
        backgroundColor: theme.palette.teriary.main,
        opacity: 0.7,
        '&:hover': {
            opacity: 1,
            backgroundColor: theme.palette.teriary.main
        },
    },
    tooltip: {
        backgroundColor: theme.palette.quaternary.dark,
        fontSize: '0.9em'
    },
    noPointerEvents: {
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        '& div,p,h1': {
            pointerEvents: 'none',
        }
    }
}))


const LandingPage = ({ handleRouteChange, handleToggleForm, handleFetch, isSignedIn }) => {
    const classes = useStyles();
    const [growOn, setGrowOn] = React.useState(false);
    const [popupDimensions, setPopupDims] = React.useState({ top: 0, left: 0, x: 0, y: 0, translate: { x: 0, y: 0 } });
    const [popupContent, setPopupContent] = React.useState('')
    const [publicImages, setPublicImages] = React.useState([])
    const transitionDuration = 0.1;

    React.useEffect(() => {
        if (!publicImages.length) {
            const fetchPublicImages = async () => {
                const publicImagesJson = await handleFetch('publicimages', 'get');
                const publicImages = JSON.parse(publicImagesJson);
                setPublicImages(await publicImages)
            }
            fetchPublicImages();
        }

    }, [publicImages.length, handleFetch])



    const handleGrow = (event, content = '') => {
        if (!growOn) {
            const { target } = event;
            const { top, left, height, width } = target.getBoundingClientRect();
            setGrowOn(true);
            setPopupContent(content)
            const { innerWidth, innerHeight } = window;
            const translateY = innerHeight / 2 - (top + height / 2);
            const translateX = innerWidth / 2 - (left + width / 2);
            setPopupDims({ translate: { x: translateX, y: translateY }, transition: transitionDuration, target: target })
        }
    }



    const handleClick = (itemClicked, event) => {
        switch (itemClicked) {
            case 'canvas':
                handleRouteChange('canvas');
                break;
            case 'welcome':
                handleGrow(event, React.cloneElement(logo, { className: classes.popupLogo }));
                break;
            case 'current':
                handleGrow(event, currentFeatures);
                break;
            case 'future':
                handleGrow(event, futureUpdates);
                break;
            case 'description':
                handleGrow(event, description);
                break;
            default:
                return;

        }
    }

    const handlePopupClose = () => {
        setGrowOn(false);
    }

    const description = (
        <div>
            <p className={classes.subTitle}>So, what is this app?</p>
            <p className={classes.paragraph}>
                This is a project I am currently working on in order to build up my portfolio.<br></br>
        My goal in this project is to create an app in which users will be able to
        draw and edit svg shapes and export them as an svg element or a png image.<br></br><br></br>
        Last updated: 21/11/20
    </p>
        </div>
    )


    const logo = (
        <div className={classes.logo} style={{ pointerEvents: 'none' }}>
            <div id='image'></div>
        </div>

    )

    const canvasLink = (
        <div className={classes.canvasLink}>

            <div id='image'>
            </div>
    <Button classes={{ root: classes.tryMeRoot, label: classes.buttonLabel }} variant='text' onClick={(e) => handleClick('canvas', e)}>{isSignedIn ? 'Go to canvas!' : 'Try me!'}</Button>
            {!isSignedIn ?
                <div>
                    <Button classes={{ root: classes.formButtonRoot, label: classes.buttonLabel }} variant='contained' onClick={(e) => handleToggleForm(true, 'signin')}>Sign in</Button>
                    <Button classes={{ root: classes.formButtonRoot, label: classes.buttonLabel }} variant='contained' onClick={(e) => handleToggleForm(true, 'register')}>Register</Button>
                </div>
                :
                false
            }


        </div>
    )

    const currentFeatures = (
        <div className={classes.noPointerEvents}>
            <p className={classes.subTitle}>Current features</p><br></br>
            <ul className={classes.paragraph}>
                <li>You can Sign up and login!</li>
                <li>You can draw SVG lines on a canvas!</li>
                <li>You can select and move the lines you've drawn around on the canvas!</li>
                <li>You can change the line color, width and opacity!</li>
                <li>You can save your images to the database!</li>
                <li>You can view your saved images in the gallery!</li>
                <li>You can export the shapes you made as a {`<svg></svg>`} element, or a .png image!</li>
            </ul>
        </div>
    )

    const futureUpdates = (
        <div className={classes.noPointerEvents}>
            <p className={classes.subTitle}>What's next?</p><br></br>
            <ul className={classes.paragraph}>
                <li>Rotating shapes</li>
                <li>Resizing shapes</li>
                <li>User profiles</li>
                <li>Fixing Undo/Redo so it still works correctly after using the Select tool</li>
            </ul>
        </div>
    )

    const getPublicImagesArray = () => {
        if (publicImages.length) {
            return publicImages.map((imageObj, i) => {
                if (imageObj?.pngBase64 && i < 6) {
                    const newData = 'data:image/png;base64, ' + imageObj.pngBase64;
                    return (
                        <Tooltip key={i} classes={{ tooltipArrow: classes.tooltip }} title={`Uploaded by: ${imageObj.uploader}`} arrow>
                            <img style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.5)', width: '100%', height: '100%' }} key={i} alt='' src={newData}></img>
                        </Tooltip>
                    )
                } else {
                    return ''
                }
            })
        }

    }

    const screenShot = (
        <div>
            <p className={classes.subTitle}>Last images by users</p>
            <div className={classes.imagesWrapper}>
                <div className={classes.publicUploads}>{getPublicImagesArray()}</div>
            </div>
        </div>
    )

    return (
        <div className={classes.root}>
            <Grid container justify='center' className={classes.container}>
                <Grid item xs={10} sm={4} md={2} lg={3} xl={3}
                    onClick={(e) => handleClick('description', e)}
                    className={classes.link}>
                    <div className={classes.noPointerEvents}>
                        <p className={classes.subTitle}>So, what is this app?</p>
                    </div>
                </Grid>

                <Grid item xs={10} sm={7} md={5} lg={5} xl={5}
                    onClick={(e) => handleClick('welcome', e)}
                    className={classes.link}>
                    {logo}
                </Grid>

                <Grid item xs={10} sm={11} md={3} lg={3} xl={3}
                    className={classes.link}>
                    {canvasLink}
                </Grid>

                <Grid item xs={10} sm={6} md={2} lg={3} xl={3}
                    onClick={(e) => handleClick('current', e)}
                    className={classes.link}>
                    <div className={classes.noPointerEvents}>
                        <p className={classes.subTitle}>Current features</p>
                    </div>
                </Grid>

                <Grid item xs={10} sm={5} md={2} lg={3} xl={3}
                    onClick={(e) => handleClick('future', e)}
                    className={classes.link}>
                    <div className={classes.noPointerEvents}>
                        <p className={classes.subTitle}>What's next?</p>
                    </div>
                </Grid>

                <Grid item xs={10} sm={11} md={6} lg={5} xl={5}
                    className={classes.link}>
                    {screenShot}
                </Grid>

            </Grid>
            {growOn ?
                <PopupWrapper>
                    <Popup
                        popupDimensions={popupDimensions}
                        handlePopupClose={handlePopupClose}
                        content={popupContent}>
                    </Popup>
                </PopupWrapper>
                : false
            }


        </div>)
}

export default LandingPage;



//old:
// const handleGrow = (event, newNode=undefined) => {
    //     const growRegex = /\s+([\w]+)-grow-[\d]+/g;
    //     const linkRegex = /\s+([\w]+)-link-[\d]+/g;
    //     const clone = newNode ? newNode : event.target.cloneNode({ deep: true })

    //     if (!event.target.className.match(growRegex)) {
    //         if (growOn) {
    //             return;
    //         }
    //         setGrowOn(true)

    //         const { top, left, height, width } = event.target.getBoundingClientRect();
    //         const { style: newNodeStyle } = clone;

    //         newNodeStyle.top = `${top}px`;
    //         newNodeStyle.left = `${left}px`;
    //         newNodeStyle.height = '50%'
    //         newNodeStyle.position = 'fixed';
    //         clone.className = clone.className.replace(linkRegex, ` ${classes.grow}`);

    //         setInsertedNode(event.target.appendChild(clone))

    //         const moveToCenter = (nodeStyle) => {
    //             const { innerWidth, innerHeight } = window;
    //             console.log(innerHeight)
    //             const offset = innerHeight > 650 ? -150: 0;
    //             const translateY = innerHeight / 2 - (top + height / 2) + offset;
    //             const translateX = innerWidth / 2 - (left + width / 2)
    //             nodeStyle.transition = 'all 0.5s';
    //             nodeStyle.transform = `translate(${translateX}px, ${translateY}px)`;
    //         }
    //         setTimeout(() => moveToCenter(newNodeStyle), 50)

    //     } else {
    //         const { style: oldNodeStyle } = event.target;
    //         setGrowOn(false);
    //         oldNodeStyle.transform = `translate(0,0)`
    //         setTimeout(() => insertedNode.parentNode.removeChild(insertedNode), 500)
    //     }
    // }