import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
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

const PendingView = () => (
  <View
    style={{
      width: '100%',
      flex: 1,
      backgroundColor: '#313538',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <Text style={styles.buttonText}>{I18n.t('title_not_auth')}</Text>
  </View>
);


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
      depth: 0,
      type: 'back',
      whiteBalance: 'auto',
      ratio: '16:9',
      mFlagCam: flagCam,
      mHasBack: hasBack,
      mUrl: url,
      spinner: false,
    };
    this.photoQuality = 640;
    console.log(this.state.mFlagCam);
    console.log(this.state.mHasBack);
    console.log(this.state.mUrl);
  }

  componentWillMount() {
    console.log('componentWillMount');
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      mFlagCam: nextProps.navigation.state.params.flagCam,
      mHasBack: nextProps.navigation.state.params.hasBack,
      mUrl: nextProps.navigation.state.params.url,
    })
  }

  takePicture = async () => {
    if (this.camera) {
      options = {
        fixOrientation: true,
        orientation: 'portrait'
      };
      const data = await this.camera.takePictureAsync(options);
      console.log(data)
      this.setState({
        spinner: true
      })
      ImageResizer.createResizedImage(data.uri, this.photoQuality, (this.photoQuality * 4) / 3, 'JPEG', 70)
        .then(({ uri }) => {
          this.setState({
            spinner: false
          })
          this.props.navigation.navigate('ConfirmInfo', {
            isCam : true,
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
  }

  renderCamera() {
    return (
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        onCameraReady={
          console.log('onCameraReady')
        }
        style={styles.preview}
        type={this.state.type}
        flashMode={this.state.flash}
        autoFocus={this.state.autoFocus}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}>
        {({ camera, status, recordAudioPermissionStatus }) => {
          if (status !== 'READY') return <PendingView />;
          return (
            <View style={{
              flex: 1,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}>
              <View style={{ backgroundColor: '#313538', width: '100%', height: 50 }} />
              <View style={{
                width: '100%',
                backgroundColor: '#313538',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                bottom: 0
              }}>
                <TouchableOpacity
                  underlayColor='#fff'
                  onPress={this.takePicture.bind(this)}>
                  <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#f33f5e', '#ab6f84']} style={[styles.button, styles.buttonTwo]}>
                    <Text style={styles.buttonText}>{this.state.mFlagCam == Constant.TYPE_FRONT ? I18n.t('title_take_front') : I18n.t('title_take_back')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

            </View>
          );
        }}
      </RNCamera>
    );
  }

  render() {
    return <View style={styles.container}>
      {this.renderCamera()}
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
  preview: {
    flex: 1,
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 20,
    paddingLeft: 40,
    paddingRight: 40
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  spinnerTextStyle: {
    color: '#fff'
  },

});