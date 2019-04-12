import React, { Component } from 'react';

import { CameraKitCameraScreen } from 'react-native-camera-kit';

export default class CameraScreen extends Component {
 
  static navigationOptions = {
    header: null,
  };

  onBottomButtonPressed(event) {
    const captureImages = JSON.stringify(event.captureImages)
    const filePath = event.captureImages[0]
    console.log('FilePathCam' + filePath)
    console.log('captureImages' + captureImages)


    this.props.navigation.navigate('ConfirmInfo', {
      filePath: filePath,
      typeTake: 1,
      flagCam: 1
    })
  }

  render() {
    return (
      <CameraKitCameraScreen
        onBottomButtonPressed={(event) => this.onBottomButtonPressed(event)}
        captureButtonImage={require('../img/cameraButton.png')}
        cameraOptions={{
          flashMode: 'off',             
          focusMode: 'on',              
          zoomMode: 'on',
          ratioOverlay:'3:4'       
        }}
      />
    );
  }
}



