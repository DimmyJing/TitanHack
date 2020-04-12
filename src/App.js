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
import glassInfo from './assets/glassinfo.png';
import paperInfo from './assets/paperinfo.png';
import metalInfo from './assets/metalinfo.png';
import cardboardInfo from './assets/cardboardinfo.png';
import plasticInfo from './assets/plasticinfo.png';
import trashInfo from './assets/trashinfo.png';
import retakeButton from './assets/retakebutton.png';
import DIYLabel from './assets/diylabel.png';
import googleMaps from './assets/googlemaps.png';

// Other stuff
import DIY from './DIY';

// Extern Libraries
import { Camera } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import request from 'request';


const isMobile = window.innerWidth <= 500;


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
      if (!isMobile)
        setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getSize, isClient]);

  return windowSize;
}


function App() {
  const size = useWindowSize();
  // let imageShiftWidth = Math.max(0, size.height / 17 * 10 - size.width);
  let imageShiftWidth = 0;
  let faceShiftHeight = (size.height - 600) / 2;
  let containerStyle = {
    backgroundColor: "#8db283",
    minHeight: size.height + (isMobile ? 100 : 0),
    width: size.width,
  }
  let cameraWidth = Math.min(size.height / 384 * 512, size.width);
  let cameraHeight = cameraWidth / 512 * 384;
  let cameraShift = (size.width - cameraWidth) / 2;

  const [screenID, setScreenID] = useState(0);
  const [dataURI, setDataURI] = useState('');
  const [infographicURI, setInfographicURI] = useState('');
  const [DIYLink, setDIYLink] = useState('');
  const [DIYImage, setDIYImage] = useState('');
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [addr, setAddr] = useState('');

  let topShift = -25;
  let botShift = 10;

  let geolocationSuccess = function(position) {
    setLongitude(position.coords.longitude);
    setLatitude(position.coords.latitude);
    console.log("Geolocation success!\n\nlat = " + latitude + "\nlng = " + longitude);
  };

  let tryAPIGeolocation = function() {
    request.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCmtiX2CD35ks8H5W5Kj0wJTlekWLIy3I8", function(success) {
      geolocationSuccess({coords: {latitude: success.location.lat, longitude: success.location.lng}});
    });
  };

  let tryGeolocation = function() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(geolocationSuccess, tryAPIGeolocation,
        {maximumAge: 50000, timeout: 20000, enableHighAccuracy: true});
    else
      tryAPIGeolocation();
  };

  tryGeolocation();

  function takePhoto(dataUri) {
    setDataURI(dataUri);

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      let state = '';
      if (xhr.readyState === XMLHttpRequest.DONE)
        state = xhr.responseText;
      if (state === "cardboard")
        setInfographicURI(cardboardInfo);
      else if (state === "glass")
        setInfographicURI(glassInfo);
      else if (state === "metal")
        setInfographicURI(metalInfo);
      else if (state === "paper")
        setInfographicURI(paperInfo);
      else if (state === "plastic")
        setInfographicURI(plasticInfo);
      else if (state === "trash")
        setInfographicURI(trashInfo);

      if (state && state !== "trash") {
        let randomIndex = Math.floor(Math.random() * 10);
        let [link, image] = DIY[state][randomIndex];
        setDIYLink(link);
        setDIYImage(image);
      }
      
      let locXHR = new XMLHttpRequest();
      locXHR.onreadystatechange = function() {
        let text = locXHR.responseText;
        console.log(text)
        setAddr(text);
      }
      locXHR.open("GET", "http://titanhack.dimmyjing.com:5000/getnearestdisposal/" + longitude + ":" + latitude + ":" + state);
      locXHR.setRequestHeader('Content-Type', 'application/json');
      if (state)
        locXHR.send();
    }
    xhr.open("POST", "http://titanhack.dimmyjing.com:5000/predictimage", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(dataUri);
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [screenID]);

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
      {(screenID === 1 || screenID === 2) ? <div>
          <img src={cameraBorder} style={{position: "absolute", width: cameraWidth, height: cameraHeight, left: cameraShift, zIndex: 1}} alt=""/>
          <img src={backButton} style={{position: "absolute", width: 80, height: 60, left: cameraShift + 30 / 414 * cameraWidth, top: 25 / 310 * cameraHeight, zIndex: 1}} onClick={() => setScreenID(0)} alt=""/>
          <img src={retakeButton} style={{position: "absolute", width: 80, height: 60, left: cameraShift + cameraWidth - 100 / 414 * cameraWidth, top: 25 / 310 * cameraHeight, zIndex: 1}} onClick={() => setDataURI('')} alt=""/>
          {dataURI ? <div>
            <img src={dataURI} style={{width: cameraWidth, height: cameraHeight, left: cameraShift}} alt=""/>
            <img src={infographicURI} style={{width: size.width, marginTop: 20}} alt=""/>
          </div> : <div style={{position: "relative", width: cameraWidth, height: cameraHeight, left: cameraShift}}><Camera onTakePhotoAnimationDone={takePhoto} idealResolution={{width: 512, height: 384}}/></div>}
        </div> : <div/>}
      {(screenID === 1 && addr) ? <div>
          <a href={"https://maps.google.com/?q=" + addr}>
            <img src={googleMaps} style={{width: size.width}} alt=""/>
          </a>
        </div> : <div/>}
      {(screenID === 2 && DIYImage) ? <div>
          <a href={DIYLink}>
            <img src={DIYLabel} style={{width: size.width}} alt=""/>
            <img src={DIYImage} style={{width: size.width}} alt=""/>
          </a>
        </div> : <div/>}
    </div>
  );
}

export default App;
