import React, { Component } from 'react';
import { CameraKitCameraScreen } from 'react-native-camera-kit';
import * as Constant from '../Constant';

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
      filePath: filePath.uri,
      typeTake: Constant.TYPE_TAKE_CAMERA,
      flagCam: Constant.TYPE_CAMERA_FRONT
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
        }}
      />
    );
  }
}



