import './App.css';
import React from 'react'
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo.js'
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm.js"
import Rank from "./components/Rank/Rank.js"
import ParticlesBg from 'particles-bg';
import Clarifai from 'clarifai'
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js'
import 'tachyons'

const app = new Clarifai.App({
  apiKey: process.env.REACT_APP_CLARIFAI_API_KEY // added to a .env file which is git ignored
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],
    }
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

    console.log('click');

    app.models
    .predict(
      'f76196b43bbd45c99b4f3cd8e8b40a8a', // This is the face detect model ID
      this.state.input // You have to use input here, not imageUrl .. why?
    )
    .then((response) => {
      this.displayFaceBoxes(response);
    })
    .catch((err) => {
      console.log(err);
    });

  }

  render() {
    return (
      <div className="App">
        <ParticlesBg color='#ffffff' type="cobweb" bg={true}/> {/* bg sets z-index to -1 */}
        <Navigation /> {/* Where we'll have our sign out */}
        <Logo />
        <Rank />
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition boxes={this.state.boxes} imageUrl={this.state.imageUrl}/>
      </div>
    );
  }
  
}

export default App;
