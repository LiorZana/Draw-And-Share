import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation.js';
import DrawArea from './containers/DrawArea/DrawArea.js';
import LandingPage from './components/LandingPage/NewLandingPage.js';
import PopupWrapper from './containers/PopupWrapper/PopupWrapper.js';
import Footer from './components/Footer/Footer.js';
import Form from './components/Form/Form.js';
import Gallery from './components/Gallery/Gallery.js';
import { withStyles } from "@material-ui/core/styles";
import triBackground from './trianglifyBackground.svg';
import './App.css';


const styles = theme => {
  const palette = theme.palette;
  return {
    root: {
      backgroundImage: `url(${triBackground})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      zIndex: -1,
      fontFamily: theme.typography.body1.fontFamily,
      fontSize: '16px',
      width: '100%',
      height: '100%',
      padding: 0,
      margin: 0,
      color: palette.teriary.light,
      overflow: 'auto',
    },
    gridCon: {
      '& >*': {
        height: '100%'
      }
    }
  }
}

const initialUserState = {
  user: {
    id: -1,
    email: '',
    username: '',
    password: '',
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      isFormOpen: false,
      formType: '',
      isPromptOpen: false,
      promptContent: { text: 'noText', buttons: [], type: '' },
      isMouseOnForm: false,
      isMouseOnPrompt: false,
      route: 'home',
      isSignedIn: false,
      canvasHTML: '',
      canvasUrl: '',
      user: {
        id: -1,
        email: '',
        username: '',
        password: '',
        joined: ''
      }
    }
  }


  handleToggleForm = (isOpen, formType) => {
    if (formType !== undefined) {
      this.setState({ formType: formType })
    }
    this.setState({ isFormOpen: isOpen })
  }

  handleTogglePrompt = (isOpen, promptObj = { text: 'noText', button: [] }) => {
    this.setState({ isPromptOpen: isOpen, promptContent: promptObj })
  }

  handleWrapperClick = (event) => {
    if (this.state.isFormOpen && !this.state.isMouseOnForm) {
      this.handleToggleForm(false);
    } else if (this.state.isPromptOpen && !this.state.isMouseOnPrompt) {
      this.handleTogglePrompt(false);
    }
  }

  getIsMouseOnForm = (isMouseOnForm) => {
    this.setState({ isMouseOnForm: isMouseOnForm })
  }

  getIsMouseOnPrompt = (isMouseOnPrompt) => {
    this.setState({ isMouseOnPrompt: isMouseOnPrompt })
  }


  handleRouteChange = (route) => {
    this.setState({ route: route })
  }

  loadUser = (data) => {
    console.log(data)
    this.setState({
      isSignedIn: true,
      isMouseOnForm: false,
      user: {
        id: data.userId,
        username: data.userName,
        email: data.email,
        joined: data.joined,
        uploads: data.images
      }
    })
    this.handleRouteChange('canvas')
    this.handleToggleForm(false);
  }

  handleSignOut = () => {
    this.setState(Object.assign({}, this.state, initialUserState, { isSignedIn: false }))
    this.handleRouteChange('home')
  }


  handleFetch = async (route = '', method = 'get', bodyObj = {}) => {
    const response = await fetch(`https://drawandshare-api.herokuapp.com/${route}/`, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: method === 'get' ? null : JSON.stringify(Object.assign({}, bodyObj, { id: this.state.user.id }))
    })
    const data = await response.json();
    return await data;
  }


  renderSwitch = () => {
    switch (this.state.route) {
      case 'home':
        return <LandingPage isSignedIn={this.state.isSignedIn} handleFetch={this.handleFetch} handleToggleForm={this.handleToggleForm} handleRouteChange={this.handleRouteChange} />;
      case 'canvas':
        return <DrawArea isSignedIn={this.state.isSignedIn} promptSettings={{ isPromptOpen: this.state.isPromptOpen, promptContent: this.state.promptContent, getIsMouseOnPrompt: this.getIsMouseOnPrompt, handleWrapperClick: this.handleWrapperClick }} handleTogglePrompt={this.handleTogglePrompt} handleFetch={this.handleFetch} />;
      case 'gallery':
        return <Gallery handleFetch={this.handleFetch} userId={this.state.user.id} />;
      default:
        return <LandingPage handleToggleForm={this.handleToggleForm} handleRouteChange={this.handleRouteChange} />;
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root} >
        {this.state.route !== 'home' ? <Navigation handleSignOut={this.handleSignOut} isSignedIn={this.state.isSignedIn} handleRouteChange={this.handleRouteChange} handleToggleForm={this.handleToggleForm} /> : false}
        {this.renderSwitch()}


        {!this.state.isFormOpen ? false :
          <PopupWrapper handleWrapperClick={this.handleWrapperClick}>
            <Form formType={this.state.formType} loadUser={this.loadUser} setMouseOnForm={this.getIsMouseOnForm} />
          </PopupWrapper>}
        <Footer />

      </div >
    );
  }

}

export default withStyles(styles, { withTheme: true })(App);
