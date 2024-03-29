import './App.css';
import React from 'react'
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo.js'
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm.js"
import Rank from "./components/Rank/Rank.js"
import ParticlesBg from 'particles-bg';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js'
import SignIn from "./components/SignIn/SignIn.js"
import Register from "./components/Register/Register.js"
import 'tachyons'

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin', // keeps track of where we are on the page
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}
class App extends React.Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    fetch('http://localhost:3000/')
    .then(response => response.json())
    .then(data => console.log(data));
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  displayFaceBoxes = (data) => {
    const clarifaiFaces = data.outputs[0].data.regions.map((region) => {return region.region_info.bounding_box});
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    const boxes = clarifaiFaces.map((face => {
      return {
        leftCol: face.left_col * width,
        topRow: face.top_row * height,
        rightCol: width - (face.right_col * width),
        bottomRow: height - (face.bottom_row * height)
      }
    }));

    this.setState({boxes: boxes})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});

    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          input: this.state.input
      })
    })
    .then((response) => response.json())
    .then((response) => {
      if(response)
      {
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries:count})) // Object.assign, you pass in the object you want to change, and what you want to change in it
        })
        .catch((err) => console.log(err));
      }
      this.displayFaceBoxes(response);
    })
    .catch((err) => {
      console.log(err);
    });

  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initialState);
    } 
    else if (route === 'home') {
      this.setState({isSignedIn: true})
    }

    this.setState({route: route});
  }

  render() {
    return (
      <div className="App">
        <ParticlesBg color='#ffffff' type="cobweb" bg={true}/> {/* bg sets z-index to -1 */}

        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        { this.state.route === 'home' ? 
            <div><Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition boxes={this.state.boxes} imageUrl={this.state.imageUrl}/>
            </div>
           
              : (
                this.state.route === 'signin' ?
                <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              )
           
         }
      </div>
    );
  }
  
}

export default App;
