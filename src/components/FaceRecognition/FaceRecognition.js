import React from 'react';
import './FaceRecognition.css'

const FaceRecognition = (props) => {
    const box = props.box;
    if(props.imageUrl==='')
    {
        return(<div></div>);
    }
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
             <img id='inputimage' alt='faceimage' src={props.imageUrl} width='500px' height='auto'/> {/* inputimage will be found using document.getElementById in App.js */}
             <div className='bounding-box' style={{top:box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
            </div>
        </div>
    )
}

export default FaceRecognition;