import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';

// Images
import backgroundLeftHalf from './assets/background_left_half.png';
import backgroundRightHalf from './assets/background_right_half.png';
import face1 from './assets/face1.png';
import face1quote from './assets/face1quote.png';
import face2 from './assets/face2.png';
import face2quote from './assets/face2quote.png';
import banner from './assets/banner.png';
import cameraBorder from './assets/cameraborder.png';
import backButton from './assets/backbutton.png';

// Extern Libraries
import { Camera } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';


function useWindowSize() {
  const isClient = typeof window === 'object';

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return false;
    }
    
    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getSize, isClient]); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}


function App() {
  const size = useWindowSize();
  // let imageShiftWidth = Math.max(0, size.height / 17 * 10 - size.width);
  let imageShiftWidth = 0;
  let faceShiftHeight = (size.height - 600) / 2;
  let containerStyle = {
    backgroundColor: "#8db283",
    height: size.height,
    width: size.width,
  }
  let cameraWidth = Math.min(size.height / 384 * 512, size.width);
  let cameraHeight = cameraWidth / 512 * 384;
  let cameraShift = (size.width - cameraWidth) / 2;

  const [screenID, setScreenID] = useState(0);
  const [dataURI, setDataURI] = useState('');

  let topShift = -25;
  let botShift = 10;

  return (
    <div className="App" style={containerStyle}>
      {(screenID === 0) ? (
        <div>
          <div style={{position: "absolute", left: (size.width - 350) / 2, top: (size.height - 110) / 2 + 5, zIndex: 1}}>
            <img src={banner} style={{width: 330, height: 110}} alt=""/>
          </div>
          <div style={{position: "absolute", left: -imageShiftWidth, height: size.height, width: size.width, overflow: "hidden"}}>
            <img src={backgroundLeftHalf} style={{height: size.height, float: "left"}} alt=""/>
          </div>
          <div style={{position: "absolute", right: -imageShiftWidth, height: size.height, width: size.width, overflow: "hidden"}}>
            <img src={backgroundRightHalf} style={{height: size.height, float: "right"}} alt=""/>
          </div>
          <div style={{position: "absolute", zIndex: 1, left: (size.width - 300) / 2, top: faceShiftHeight + topShift}}>
            <img src={face1} style={{width: 300}} alt=""/>
          </div>
          <div style={{position: "absolute", zIndex: 3, left: (size.width - 300) / 2 + 40, top: faceShiftHeight + 40 + topShift}}>
            <button style={{borderRadius: "50%", width: 220, height: 210, background: "transparent", border: "none", outline: "none"}} onClick={() => setScreenID(1)}></button>
          </div>
          <div style={{position: "absolute", zIndex: 2, left: (size.width - 300) / 2 + 10, top: faceShiftHeight + 20 + topShift}}>
            <img src={face1quote} style={{width: 300}} alt=""/>
          </div>
          <div style={{position: "absolute", zIndex: 1, left: (size.width - 300) / 2, bottom: faceShiftHeight + botShift}}>
            <img src={face2} style={{width: 300}} alt=""/>
          </div>
          <div style={{position: "absolute", zIndex: 2, left: (size.width - 300) / 2 - 160, bottom: faceShiftHeight - 40 + botShift}}>
            <img src={face2quote} style={{width: 300}} alt=""/>
          </div>
          <div style={{position: "absolute", zIndex: 3, left: (size.width - 300) / 2 + 40, bottom: faceShiftHeight + 40 + botShift}}>
            <button style={{borderRadius: "50%", width: 220, height: 210, background: "transparent", border: "none", outline: "none"}} onClick={() => setScreenID(2)}></button>
          </div>
        </div>) : <div/>}
      {(screenID === 1 || screenID === 2) ? (
        <div>
          <img src={cameraBorder} style={{position: "absolute", width: cameraWidth, height: cameraHeight, left: cameraShift, zIndex: 1}} alt=""/>
          <img src={backButton} style={{position: "absolute", width: 80, height: 60, left: cameraShift + 30, top: 25, zIndex: 1}} onClick={() => setScreenID(0)} alt=""/>
          {dataURI ? <div>
            <img src={dataURI} style={{width: cameraWidth, height: cameraHeight, left: cameraShift}} alt=""/>
          </div> : <div style={{position: "relative", width: cameraWidth, height: cameraHeight, left: cameraShift}}><Camera onTakePhotoAnimationDone={(dataUri) => setDataURI(dataUri)} idealResolution={{width: 512, height: 384}}/></div>}
          <span>
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
            Hello World
          </span>
        </div>) : <div/>}
    </div>
  );
}

export default App;
