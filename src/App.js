import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo.js'
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm.js"
import Rank from "./components/Rank/Rank.js"
import ParticlesBg from 'particles-bg';
import 'tachyons'

function App() {
  return (
    <div className="App">
      <ParticlesBg color='#ffffff' type="cobweb" bg={true}/> {/* bg sets z-index to -1 */}
      <Navigation /> {/* Where we'll have our sign out */}
      <Logo />
      <Rank />
      <ImageLinkForm/>
    </div>
  );
}

export default App;
