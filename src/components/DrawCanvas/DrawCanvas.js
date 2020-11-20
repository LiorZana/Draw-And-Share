import React, { Component } from 'react';
import BoundingBox from '../BoundingBox/BoundingBox.js';
import './DrawCanvas.css';


export default class DrawCanvas extends Component {
  constructor() {
    super();

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.drawCanvasRef = React.createRef();
  }


  componentDidUpdate() {
    if (!this.props.isDrawing) {
      this.SendCanvasRef();

    }
  }

  componentDidMount() {
    if(!this.detectMobile()){
      document.addEventListener('mouseup', this.handleMouseUp);
    } else {
      document.addEventListener('touchend',  this.handleMouseUp)
    }
    this.SendCanvasRef();
    console.log('canvas')

  }

  componentWillUnmount() {
    if(!this.detectMobile()){
      document.removeEventListener('mouseup', this.handleMouseUp);
    } else {
      document.removeEventListener('touchend',  this.handleMouseUp)
    }
  }

  detectMobile = () => {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

  handleMouseDown(mouseEvent) {

    const point = this.relativeCoordinatesForEvent(
      mouseEvent.button === 0 ? mouseEvent : mouseEvent.targetTouches[0]
      );
    const { handleMouseDown } = this.props;
    handleMouseDown(point, mouseEvent);
  }
  handleMouseMove(mouseEvent) {
    const point = this.relativeCoordinatesForEvent(
      mouseEvent.button === 0 ? mouseEvent : mouseEvent.targetTouches[0]
      );
    const { handleMouseMove } = this.props;
    handleMouseMove(point);
  }
  handleMouseUp() {
    this.props.handleMouseUp();
    this.SendCanvasRef();
  }

  relativeCoordinatesForEvent = (mouseEvent) => {

    const boundingRect = this.drawCanvasRef.current.getBoundingClientRect();
    const test = ({
      x: mouseEvent.clientX - boundingRect.left,
      y: mouseEvent.clientY - boundingRect.top,
    })
    return test;
    ;
  }
  getRelativeCoordinates = (e) => {
    return this.relativeCoordinatesForEvent(e);
  }


  SendCanvasRef = () => {
    const svg = this.drawCanvasRef.current.firstChild.cloneNode(true);
    const paths = svg.children;

    let boxArr = [];
    for (let i = 0; i < paths.length; i++) {
      const childClass = paths[i].getAttribute('class');
      if (childClass === 'box') {
        boxArr.push(paths[i])
      }
    }
    if (boxArr.length > 0) {
      boxArr.forEach(box => {
        svg.removeChild(box)
      })
    }
    const canvasHTML = new XMLSerializer().serializeToString(svg)
    this.props.handleSetCanvasRef(canvasHTML);
  }



  render() {
    const { lines, handleSetSelectedLine, isDrawing, dragOffset, boundingBox } = this.props;
    return (
      <div
        className="drawArea"
        style={{
          width: '100%',
          height: '100%',
          border: '1px solid black',
          cursor: 'crosshair'
        }}
        ref={this.drawCanvasRef}
        onMouseDown={this.handleMouseDown}
        onTouchStart={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onTouchMove={this.handleMouseMove}
      >
        <Drawing
          lines={lines}
          getRelativeCoordinates={this.getRelativeCoordinates}
          handleSetSelectedLine={handleSetSelectedLine}
          isDrawing={isDrawing}
          dragOffset={dragOffset}
          boundingBox={boundingBox} />
      </div>
    );
  }
}

function Drawing({ lines, handleSetSelectedLine, isDrawing, getRelativeCoordinates, dragOffset, boundingBox }) {

  const drawingRef = React.useRef();
  const mouseDownOnPath = (e, line, pathRef) => {
    handleSetSelectedLine(line, pathRef, drawingRef, getRelativeCoordinates(e))
  }


  return (
    <svg height={600} width={800} version='1.1' xmlnsXlink='http://www.w3.org/1999/xlink' ref={drawingRef} className="drawing" style={{ height: '100%', width: '100%', backgroundColor: 'white' }}>
      {lines.map((line, i) => {
        if (line === undefined) {
          return 0;
        }
        //console.log(line.boundingBox)
        return (
          <React.Fragment key={i}>
            {line.points.length > 0 ? <DrawingLine mouseDownOnPath={mouseDownOnPath} isDrawing={isDrawing} dragOffset={dragOffset} i={i} key={i} line={line} /> : 0}
            <BoundingBox x={line.boundingBox.x} y={line.boundingBox.y} width={line.boundingBox.width} height={line.boundingBox.height} translate={dragOffset} />
          </React.Fragment>
        )
      })}

    </svg>
  );
}

function DrawingLine({ line, mouseDownOnPath, dragOffset }) {

  const pathRef = React.useRef();

  const handleMouseDown = (e) => {
    mouseDownOnPath(e, line, pathRef)
  }


  const path = line.points.map(p => {
    return `L${p.x} ${p.y}`
  }).join(" ")


  const pathData = `M${line.startPoint.x} ${line.startPoint.y} ${path}`
  const lineStyle = {
    fill: 'none',
    strokeWidth: line.strokeWidth,
    stroke: line.strokeColor,
    strokeLinejoin: 'round',
    strokeLinecap: 'round'
  }


  return <path
    transform={`translate(${line.isSelectedLine ? dragOffset.x : 0} ,${line.isSelectedLine ? dragOffset.y : 0})`}
    ref={pathRef}
    onMouseDown={handleMouseDown}
    style={lineStyle}
    className="path"
    d={pathData}
  />;
}
