// import React, { Component } from 'react';
// import { Stage, Layer, Image, Line } from 'react-konva';
// import { Image as KonvaImage } from 'konva';
// import DrawCanvas from './DrawCanvas2.js';

// export default class CanvasImage extends Component {
//     constructor() {
//         super();
//         this.state = {
//             drawCanvas: <DrawCanvas recieveDrawing={this.recieveDrawing} />,
//             lines: []
//         }
//     }

//     componentDidMount() {
//         this.drawImage = new KonvaImage({
//             image: this.state.drawCanvas,
//             x: 200,
//             width: 800,
//             height: 600
//         });
//         //this.drawImage.src = this.state.drawCanvas;
//         //console.log(this.drawImage)
//     }

//     componentDidUpdate() {
//     }

//     recieveDrawing = (lines) => {
//         const newLines = lines.map(line => {
//             return line.points.map(p => [p.x, p.y]).flat()
//         })
//         //console.log(lines)
//         this.setState({
//             lines: lines
//             })

//     }
//     render() {
//         return (
//             <div>
//                 <Stage width={800} height={600}>
//                     <Layer>
//                         {this.state.lines.map((line, i) => {
//                             const points = [line.startPoint.x, line.startPoint.y]
//                             line.points.forEach(point => {
//                                 points.push(point.x, point.y)
//                             })
//                             //console.log(points)
//                             return <Line
//                                 key={i}
//                                 x={200}
//                                 y={200}
//                                 points={points}
//                                 stroke={'rgb(255,0,0)'}
//                                 strokeWidth={50}
//                                 tension={0}
//                                 lineCap="round"
//                                 globalCompositeOperation='source-over' />
//                         })}
                            
//                     </Layer>
//                 </Stage>
//             </div>)
//     }
// }
