import React from 'react';
import Tilt from 'react-parallax-tilt'
import LogoPNG from './facelogo.png'
import './Logo.css'

const Logo = () => {
    return (
        <div className="Tilt">
            <Tilt>
                <div className="imgContainer ma4 mt0 br2 shadow-2">
                    <img alt='logo' src={LogoPNG}></img>
                </div>
            </Tilt>
        </div>
    )
}

export default Logo;