import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import LinearGradient from 'react-native-linear-gradient';

export default class CameraScreen1 extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    autoFocusPoint: {
      normalized: { x: 0.5, y: 0.5 },
      drawRectPosition: {
        x: Dimensions.get('window').width * 0.5 - 32,
        y: Dimensions.get('window').height * 0.5 - 32,
      },
    },
    depth: 0,
    type: 'back',
    whiteBalance: 'auto',
    ratio: '16:9',
  };

  toggleFocus() {
    this.setState({
      autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on',
    });
  }

  touchToFocus(event) {
    const { pageX, pageY } = event.nativeEvent;
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const isPortrait = screenHeight > screenWidth;

    let x = pageX / screenWidth;
    let y = pageY / screenHeight;
    if (isPortrait) {
      x = pageY / screenHeight;
      y = -(pageX / screenWidth) + 1;
    }

    this.setState({
      autoFocusPoint: {
        normalized: { x, y },
        drawRectPosition: { x: pageX, y: pageY },
      },
    });
  }

  setFocusDepth(depth) {
    this.setState({
      depth,
    });
  }

  takePicture = async function () {
    if (this.camera) {
      const data = await this.camera.takePictureAsync();
      console.warn('takePicture ', data);
    }
  };

  renderCamera() {
    const drawFocusRingPosition = {
      top: this.state.autoFocusPoint.drawRectPosition.y - 32,
      left: this.state.autoFocusPoint.drawRectPosition.x - 32,
    };
    return (
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={{
          flex: 4,
          marginTop: 20
        }}
        type={this.state.type}
        flashMode={this.state.flash}
        autoFocus={this.state.autoFocus}
        autoFocusPointOfInterest={this.state.autoFocusPoint.normalized}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        focusDepth={this.state.depth}
        permissionDialogTitle={'Permission to use camera'}
        permissionDialogMessage={'We need your permission to use your camera phone'}>

        <View style={StyleSheet.absoluteFill}>
          <View style={[styles.autoFocusBox, drawFocusRingPosition]} />
          <TouchableWithoutFeedback onPress={this.touchToFocus.bind(this)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
        </View>
      </RNCamera>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#313538' }} />
        {this.renderCamera()}
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#313538' }}>
          <TouchableOpacity
            underlayColor='#fff'
            onPress={this.takePicture.bind(this)}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#f33f5e', '#ab6f84']} style={[styles.button, styles.buttonTwo]}>
              <Text style={styles.buttonText}>Snap</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#313538'
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 30,
    marginTop: 10,
    marginLeft: 30,
    marginRight: 30,
  },
  autoFocusBox: {
    position: 'absolute',
    height: 64,
    width: 64,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'white',
    opacity: 0.4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
});