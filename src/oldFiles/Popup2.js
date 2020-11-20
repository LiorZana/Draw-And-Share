// import React, { Component } from 'react';

// class Popup extends Component {
//     constructor() {
//         super();
//         this.state = {
//             translate: { x: 0, y: 0 },
//             transition: 'none',
//             intervalId: ''
//         }
//     }

//     setTransition = () => {
//         const { translate: propsTranslate, transition } = this.props.popupDimensions;
//         const { translate: stateTranslate } = this.state;
//         if (propsTranslate.x !== stateTranslate.x || propsTranslate.y !== stateTranslate.y) {
//             this.setState({ translate: { x: propsTranslate.x, y: propsTranslate.y }, transition: `all ${transition}s` })
//         }
//     }

//     componentDidMount() {
//         this.setState({ intervalId: setInterval(this.setTransition, 50) })
//     }

//     componentWillUnmount() {
//         clearInterval(this.state.intervalId)
//     }

//     render() {
//         const { top, left, width, height } = this.props.popupDimensions;
//         const { translate } = this.state;
//         return (
//             <div style={{
//                 backgroundColor: '#ffffff',
//                 position: 'fixed',
//                 width: width,
//                 height: height,
//                 top: top,
//                 left: left,
//                 transform: `translate(${translate.x}px, ${translate.y}px)`,
//                 transition: this.state.transition
//             }}>
//                 <button>abc</button>
//                 {this.props.children}
//             </div>
//         )
//     }

// }

// export default Popup;