import React, { Component } from 'react';

class ImageObj extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
        };
        this.handleImageLoaded = this.handleImageLoaded.bind(this);
        this.image = React.createRef();
    }


    componentDidMount() {
        const img = this.image.current;
        if (img && img.complete) {
            this.handleImageLoaded();
        }
    }

    handleImageLoaded() {
        if (!this.state.loaded) {
            console.log('image loaded');
            this.props.handleImageLoaded();
        }
    }


    render() {
        return (
            <img src='' alt='abc' ref={this.image} onLoad={this.handleImageLoaded} />
        );
    }
}

export default ImageObj;