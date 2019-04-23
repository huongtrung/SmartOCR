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
import * as Constant from '../Constant';
import Spinner from 'react-native-loading-spinner-overlay';
import I18n, { getLanguages } from 'react-native-i18n';
import ImageResizer from 'react-native-image-resizer';

I18n.fallbacks = true;

I18n.translations = {
  'en': require('../translation/en'),
  'ja': require('../translation/ja'),
}

export default class CameraScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    const { navigation } = this.props
    flagCam = navigation.getParam('flagCam', Constant.TYPE_FRONT)
    hasBack = navigation.getParam('hasBack', true)
    url = navigation.getParam('url', '')

    this.state = {
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
      mFlagCam: flagCam,
      mHasBack: hasBack,
      mUrl: url,
      spinner: false
    };
    console.log(this.state.mFlagCam);
    console.log(this.state.mHasBack);
    console.log(this.state.mUrl);
  }

  componentWillMount() {
    console.log('componentWillMount');
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.navigation.state.params.flagCam);
    this.setState({
      mFlagCam: nextProps.navigation.state.params.flagCam,
      mHasBack: nextProps.navigation.state.params.hasBack,
      mUrl: nextProps.navigation.state.params.url,
    })
  }

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
      options = { fixOrientation: true, quality: 0.5 };
      this.setState({
        spinner: true
      })
      const data = await this.camera.takePictureAsync(options);
      ImageResizer.createResizedImage(data.uri, data.width, data.height, 'JPEG', 50)
        .then(({ uri }) => {
          this.setState({
            spinner: false
          })
          this.props.navigation.navigate('ConfirmInfo', {
            filePath: uri,
            typeTake: Constant.TYPE_TAKE_CAMERA,
            flagCam: this.state.mFlagCam,
            hasBack: this.state.mHasBack,
            url: this.state.mUrl
          })
        })
        .catch(err => {
          console.log(err);
        });
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
          flex: 1,
        }}
        type={this.state.type}
        flashMode={this.state.flash}
        autoFocus={this.state.autoFocus}
        autoFocusPointOfInterest={this.state.autoFocusPoint.normalized}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        focusDepth={this.state.depth}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}>
        <View style={StyleSheet.absoluteFill}>
          <View style={{ height: 50, backgroundColor: '#313538' }} />

          <View style={[styles.autoFocusBox, drawFocusRingPosition]} />
          <TouchableWithoutFeedback onPress={this.touchToFocus.bind(this)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
        </View>
      </RNCamera>
    );
  }

  render() {
    return <View style={styles.container}>
      {this.renderCamera()}
      <View style={{ backgroundColor: '#313538' }}>
        <TouchableOpacity
          underlayColor='#fff'
          onPress={this.takePicture.bind(this)}>
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#f33f5e', '#ab6f84']} style={[styles.button, styles.buttonTwo]}>
            <Text style={styles.buttonText}>{this.state.mFlagCam == Constant.TYPE_FRONT ? I18n.t('title_image_front') : I18n.t('title_image_back')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <Spinner
        visible={this.state.spinner}
        color="#f33f5e"
        overlayColor="black"
        textContent={I18n.t('title_progess_image')}
        textStyle={styles.spinnerTextStyle}
      />
    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flipButton: {
    flex: 0.3,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
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
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 30,
    marginRight: 30,
  }, buttonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  spinnerTextStyle: {
    color: '#fff'
  },
});