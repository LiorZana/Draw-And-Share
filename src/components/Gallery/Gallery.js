import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    root: {
        height: '100%',
        width: '100%',
        overflow: 'auto',

    },
    gridRoot: {
        border: ' 1px solid red',
        '& *': {
            transition: 'all .15s ease-in-out',
            margin: '1em',
            '& :hover': {
                transform: 'scale(1.1)',
            },
            '&:active:focus': {
                outline: 'none'
            }
        }

    },
    item: {
        display: 'flex',
        justifyContent: 'center',
        '& >img': {
            width: '100%',
        }
    }
})



class Gallery extends Component {
    constructor() {
        super()
        this.state = {
            images: []
        }
    }

    componentDidMount() {
        if (this.props.userId > 0) {
            this.fetchImages().then(images => this.setState({ images: images }))
        }

    }

    fetchImages = async () => {
        const stringifiedImagesArr = await this.props.handleFetch('gallery', 'post', {});
        const imageArr = JSON.parse(stringifiedImagesArr).map((imageObj, i) => {
            const newData = 'data:image/png;base64, ' + imageObj.pngBase64;
            return <img style={{ border: '1px solid white', backgroundColor: 'rgba(255,255,255,0.3)' }} key={i} src={newData} alt=''></img>;
        })
        return await imageArr;

    }




    render() {

        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Grid className={classes.gridRoot} justify='center' container spacing={0}>
                    {this.props.userId > 0 ?
                        (this.state.images.length ?
                            this.state.images.map((image, i) => {

                                return <Grid item className={classes.item} xl={3} lg={4} key={i} >{image}</Grid>
                            })
                            :
                            <div>NO IMAGES HERE YET</div>)

                        :
                        <div>YOU NEED TO BE SIGNED IN</div>
                    }
                </Grid>



            </div>
        )
    }


}

export default withStyles(styles, { withTheme: true })(Gallery);