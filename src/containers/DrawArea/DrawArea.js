import React, { Component } from 'react';
import DrawCanvas from '../../components/DrawCanvas/DrawCanvas.js';
import ToolButtons from '../../components/ToolButtons/ToolButtons.js'
import Slider from '@material-ui/core/Slider';
import { SketchPicker } from 'react-color';
import { withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import PopupWrapper from '../PopupWrapper/PopupWrapper.js';
import Prompt from '../../components/Prompt/Prompt.js';


const styles = theme => ({
    root: {
    },
    drawArea: {
        paddingBottom: '20vh',
        paddingTop: '10vh'
    },
    controlsArea: {
        fontSize: '1.2em',
    },
    sliderRoot: {
        marginBottom: '5em'
    },
    rail: {
        color: theme.palette.quaternary.main,
        height: '0.5em',
        borderRadius: '5px'
    },
    track: {
        color: theme.palette.quaternary.dark,
        height: '0.5em',
        borderRadius: '5px'
    },
    thumb: {
        backgroundColor: theme.palette.teriary.light,
        height: '1em',
        width: '1em'

    },
    canvas: {
        height: '100%',
        width: '100%'
    },
});

class DrawArea extends Component {
    constructor() {
        super();
        this.state = {
            lines: [],
            history: [],
            isDrawing: false,
            strokeColor: 'rgba(255, 0, 0, 1)',
            strokeWidth: 20,
            currentTool: 'Draw',
            dragStartPoint: {},
            dragOffset: { x: 0, y: 0 },
            isDragging: false,
            boundingBox: { x: 0, y: 0, width: 0, height: 0 },
            isCanvasRefChanged: true,
            drawCanvasRef: ''
        }

    }


    handleMouseDown = (point) => {
        if (this.state.currentTool === 'Draw') {
            this.setState(prevState => ({
                isDrawing: true,
                lines: [...prevState.lines, { startPoint: { x: point.x, y: point.y }, points: [], boundingBox: { x: 0, y: 0, width: 0, height: 0 } }]
            }));
        } else if (this.state.currentTool === 'Select') {
            this.setState({
                isDrawing: true,
            })
        }

    }

    handleMouseMove = (point) => {
        if (!this.state.isDrawing) {
            return;
        }
        const { currentTool } = this.state;
        const lines = [...this.state.lines];

        switch (currentTool) {
            case 'Draw':
                this.setState({
                    lines: lines.map((line, i) => {
                        if (i === lines.length - 1) {
                            return {
                                startPoint: line.startPoint,
                                points: [...line.points, { x: point.x, y: point.y }],
                                strokeColor: this.state.strokeColor,
                                strokeWidth: this.state.strokeWidth,
                                isSelectedLine: false,
                                boundingBox: { x: 0, y: 0, width: 0, height: 0 }
                            }
                        }
                        return line;
                    }),
                    isCanvasRefChanged: true
                });
                break;

            case 'Select':
                const dragStartPoint = { ...this.state.dragStartPoint }
                const mouseX = point.x
                const mouseY = point.y
                const offsetX = (dragStartPoint.x - mouseX) * -1;
                const offsetY = (dragStartPoint.y - mouseY) * -1;

                if (this.state.isDragging) {
                    this.setState({
                        dragOffset: { x: offsetX, y: offsetY },
                    })
                }
                const last = lines.pop();
                this.setState({
                    lines: [...lines, last],
                    boundingBox: Object.assign({}, this.state.boundingBox, { translate: { x: offsetX, y: offsetY } }),
                    isCanvasRefChanged: true
                })
                break;
            default:
                return;

        }
    }

    handleMouseUp = () => {
        const { dragOffset, boundingBox } = this.state;
        if (this.state.isDragging) {
            this.setState({
                isDrawing: false,
                lines: this.state.lines.filter(line => line.points.length > 0).map(line => {
                    if (!line.isSelectedLine) {
                        return line;
                    } else {
                        return Object.assign({}, line, {
                            points: line.points.map(p => {
                                return { x: p.x + dragOffset.x, y: p.y + dragOffset.y }
                            })
                        }, { startPoint: { x: line.startPoint.x + dragOffset.x, y: line.startPoint.y + dragOffset.y } },
                            {
                                boundingBox: {
                                    x: line.boundingBox.x + dragOffset.x,
                                    y: line.boundingBox.y + dragOffset.y,
                                    width: line.boundingBox.width,
                                    height: line.boundingBox.height,
                                }
                            }
                        );
                    }
                }),
                boundingBox: {
                    x: boundingBox.x + dragOffset.x,
                    y: boundingBox.y + dragOffset.y,
                    width: boundingBox.width,
                    height: boundingBox.height,
                },
                dragOffset: { x: 0, y: 0 },
                isDragging: false
            })
        } else {
            this.setState({
                isDrawing: false,
                lines: this.state.lines.filter(line => line !== undefined).filter(line => line.points.length > 0),
                boundingBox: { x: 0, y: 0, width: 0, height: 0 },
            })
            this.handleDeselect();
        }

    }


    handleStrokeWidthChange = (e, value) => {
        this.setState({ strokeWidth: value })
    }



    handleSetSelectedLine = (line, pathRef, drawingRef, relativeCoordinates) => {
        if (this.state.currentTool === 'Select') {
            const [drawingBoundingRect, pathBoundingRect] = [drawingRef.current.getBoundingClientRect(), pathRef.current.getBoundingClientRect()];
            const [drawTop, drawLeft] = [drawingBoundingRect.top, drawingBoundingRect.left]
            const [pathTop, pathLeft, pathWidth, pathHeight] = [pathBoundingRect.top, pathBoundingRect.left, pathBoundingRect.width, pathBoundingRect.height];

            const lines = [...this.state.lines]
            const selected = lines.filter(lfromArr => lfromArr === line)[0];
            const offset = selected.strokeWidth / 2;
            selected.isSelectedLine = true;
            selected.boundingBox = {
                x: pathLeft - drawLeft - offset,
                y: pathTop - drawTop - offset,
                width: pathWidth + offset * 2,
                height: pathHeight + offset * 2,
            }

            this.setState({
                isDragging: true,
                dragStartPoint: relativeCoordinates,
            })

            const notSelected = lines.filter(lfromArr => lfromArr !== line).map(line => {
                line.isSelectedLine = false;
                line.boundingBox = 0;
                line.boundingBox = { x: 0, y: 0, width: 0, height: 0 }
                return line;
            });
            const newLines = [...notSelected, selected]

            this.setState({
                lines: newLines
            })
        } else {
            return;
        }

    }


    rgbObjToString = (rgbObj) => {
        const { r, g, b, a } = rgbObj;
        return `rgba(${r}, ${g}, ${b}, ${a})`
    }


    handleLineColorChange = (e) => {
        this.setState({ strokeColor: this.rgbObjToString(e.rgb) })
    }

    handleDeselect = () => {
        this.setState({
            lines: this.state.lines.map(line => {
                line.isSelectedLine = false;
                line.boundingBox = { x: 0, y: 0, width: 0, height: 0 };
                return line;
            }),
            boundingBox: { x: 0, y: 0, width: 0, height: 0 },
        })
    }

    handleUndo = () => {
        const lines = [...this.state.lines];
        if (lines.length > 0) {
            const last = lines.pop();
            this.setState({
                lines: lines,
                history: [...this.state.history, last]
            })
        }
        return;
    }

    handleRedo = () => {
        const history = [...this.state.history]
        if (history.length > 0) {
            const lines = [...this.state.lines]
            const lastHistory = history.pop();
            this.setState({
                lines: [...lines, lastHistory],
                history: [...history]
            })
        }
        return;

    }

    handleClearCanvas = () => {
        const lines = [...this.state.lines]
        if (lines.length > 0) {
            lines.reverse();
            this.setState({
                history: [...this.state.history, ...lines],
                lines: [],
                drawCanvasRef: '<svg height="600" width="800" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" class="drawing" style="height: 100%; width: 100%; background-color: white;"></svg>'
            })
        }
        return;
    }

    handleButtonClick = (buttonText) => {
        const { handleTogglePrompt } = this.props;
        const showEmptyDrawingPrompt = () => {
            handleTogglePrompt(true, { text: 'First you gotta draw something!', buttons: [{ text: 'Ok, got it', result: false }], type: '' })
        }
        switch (buttonText) {
            case 'Select':
            case 'Draw':
                this.setState({ currentTool: buttonText })
                break;
            case 'Clear':
                this.handleClearCanvas();
                break;
            case 'Undo':
                this.handleUndo();
                break;
            case 'Redo':
                this.handleRedo();
                break;
            case 'Save as svg':
                if (this.state.lines.length) {
                    this.downloadCanvasCallback();
                } else {
                    showEmptyDrawingPrompt();
                }
                break;
            case 'Save as Png':
                if (this.state.lines.length) {
                    this.props.handleFetch('upload', 'post', { image: this.state.drawCanvasRef }).then(data => {
                        fetch(data).then(res => res.blob())
                            .then(blob => this.handleDownload(0, blob, 'myImage.png', 0))
                    })
                } else {
                    showEmptyDrawingPrompt();
                }
                break;
            case 'Upload to gallery':
                if (this.state.lines.length) {
                    const toPublicGalleryPrompt =
                    {
                        text: 'Would you also like to upload this image to our public user images gallery?',
                        buttons: [
                            { text: 'Sure', result: true },
                            { text: 'Not really..', result: false }
                        ],
                        type: 'uploadToPublic'
                    }
                    handleTogglePrompt(true, toPublicGalleryPrompt)
                } else {
                    showEmptyDrawingPrompt();
                }

                break;
            default:
                console.log('Error');
        }
    }




    handleSetCanvasRef = (canvasRef) => {
        if (this.state.isCanvasRefChanged) {
            this.setState({ drawCanvasRef: canvasRef, isCanvasRefChanged: false });
        }
        return;

    }

    downloadCanvasCallback = () => {
        this.handleDownload(this.state.drawCanvasRef, 0, 'myImage.svg', 'image/svg+xml;charset=utf-8')
    }

    handleDownload = (fileToDownload, blob, name, type) => {
        const a = document.createElement("a");
        let file = ''
        if (!blob && fileToDownload) {
            file = new Blob([fileToDownload], { type: type });
            a.href = URL.createObjectURL(file);
        } else if (blob && !fileToDownload) {
            a.href = URL.createObjectURL(blob);
        } else if (blob && fileToDownload) {
            try {
                a.href = URL.createObjectURL(blob);
            } catch (error) {
                try {
                    file = new Blob([fileToDownload], { type: type });
                    a.href = URL.createObjectURL(file);
                } catch (error) {
                    console.log('error in download', error)
                }
            }
        }

        a.download = name;
        a.click()
        URL.revokeObjectURL(file);
    }

    handlePromptClick = (promptResult, promptType) => {
        const { handleTogglePrompt } = this.props;
        switch (promptType) {
            case 'uploadToPublic':
                const linesString = JSON.stringify(this.state.lines);
                if (this.state.lines.length) {
                    this.props.handleFetch('image', 'put', { image: this.state.drawCanvasRef, lines: linesString, public: promptResult }).then(handleTogglePrompt(false))
                }
                break;
            default:
                handleTogglePrompt(promptResult)
                return;
        };
    }




    render() {
        const { currentTool, strokeColor, strokeWidth, lines, boundingBox, isDrawing, dragOffset } = this.state;
        const { classes, promptSettings, isSignedIn } = this.props;
        const { isPromptOpen, promptContent, getIsMouseOnPrompt, handleWrapperClick } = promptSettings;
        return (
            <div className={classes.root}>

                {
                    !isPromptOpen ? false :
                        <PopupWrapper handleWrapperClick={handleWrapperClick}>
                            <Prompt setMouseOnPrompt={getIsMouseOnPrompt} promptType={promptContent.type} text={promptContent.text} buttons={promptContent.buttons} handleClick={this.handlePromptClick} />
                        </PopupWrapper>
                }

                <Grid container spacing={8} justify='center' alignContent='center' className={classes.drawArea}>

                    <Grid item md={3} className={classes.controlsArea}>
                        <ToolButtons isSignedIn={isSignedIn} handleButtonClick={this.handleButtonClick} />
                        <div style={{ textAlign: 'center', marginTop: '1em' }}>
                            Icons made by <a style={{ color: 'blue', textDecoration: 'none' }} href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a style={{ color: 'blue', textDecoration: 'none' }} href="https://www.flaticon.com/" title="Flaticon">Flaticon.com</a>
                        </div>
                        <div style={{ marginTop: '2em', textAlign: 'center', fontSize: '1.5em' }}>
                            Tool: {currentTool}
                        </div>



                    </Grid>

                    <Grid item md={6}>
                        <div className={classes.canvas}>
                            <DrawCanvas
                                handleMouseDown={this.handleMouseDown}
                                handleMouseMove={this.handleMouseMove}
                                handleMouseUp={this.handleMouseUp}
                                lines={lines}
                                handleSetSelectedLine={this.handleSetSelectedLine}
                                boundingBox={boundingBox}
                                isDrawing={isDrawing}
                                dragOffset={dragOffset}
                                handleSetCanvasRef={this.handleSetCanvasRef}
                            />
                        </div>
                    </Grid>
                    <Grid item md={2}>
                        <h4>Stroke width:</h4>
                        <Slider
                            classes={{
                                root: classes.sliderRoot,
                                rail: classes.rail,
                                track: classes.track,
                                thumb: classes.thumb
                            }}
                            onChange={this.handleStrokeWidthChange}
                            value={strokeWidth}
                            aria-labelledby="discrete-slider-small-steps"
                            step={0.01}
                            aria-valuenow={5}
                            aria-valuemin={0.5}
                            aria-valuemax={200}
                            min={0.5}
                            max={200}
                            valueLabelDisplay="auto"
                        />
                        <SketchPicker color={strokeColor} onChange={this.handleLineColorChange} />
                    </Grid>
                </Grid>
            </div>
        )
    }

}

export default withStyles(styles, { withTheme: true })(DrawArea);


//non related old math:
            // const selectedPoints = [...selected.points]
            // const selectedX = selectedPoints.map(p => p.x).sort((a, b) => a-b);
            // const selectedY = selectedPoints.map(p => p.y).sort((a, b) => a-b);
            // console.log(selectedX, selectedY)
            // const highest = { x: selectedX[selectedX.length-1], y: selectedY[selectedY.length-1] }
            // const lowest = { x: selectedX[0], y: selectedY[0] }
            // const strokeWidth = this.state.strokeWidth;
            // const x = lowest.x-strokeWidth;
            // const y = lowest.y-strokeWidth;
            // const width = highest.x-x+strokeWidth;
            // const height = highest.y-y+strokeWidth;