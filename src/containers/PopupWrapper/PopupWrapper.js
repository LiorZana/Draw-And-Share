import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";

const styles = theme => {
    return {
        root: {
            position: 'fixed',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 10,
        }
    }
}

class PopupWrapper extends Component {


    render() {
        const { classes, handleWrapperClick } = this.props;
        return (<div onClick={handleWrapperClick} className={classes.root}>{this.props.children}</div>)
    }

}

export default withStyles(styles, { withTheme: true })(PopupWrapper);