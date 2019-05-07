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
import RNFetchBlob from 'rn-fetch-blob'

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
    typeDocument = navigation.getParam('typeDocument', 0)

    this.state = {
      flash: 'off',
      zoom: 0,
      autoFocus: 'on',
      depth: 0,
      type: 'back',
      whiteBalance: 'auto',
      ratio: '4:3',
      mFlagCam: flagCam,
      mHasBack: hasBack,
      mUrl: url,
      spinner: false,
      mTypeDocument: typeDocument
    };
    this.photoQuality = 640;
    console.log(this.state.mFlagCam);
    console.log(this.state.mHasBack);
    console.log(this.state.mUrl);
    console.log(this.state.mTypeDocument);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      mFlagCam: nextProps.navigation.state.params.flagCam,
      mHasBack: nextProps.navigation.state.params.hasBack,
      mUrl: nextProps.navigation.state.params.url,
      mTypeDocument: nextProps.navigation.state.params.typeDocument,
    })
    console.log(this.state.mTypeDocument);
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

      RNFetchBlob.fs.stat(data.uri)
        .then((stats) => {
          console.log(stats)
          if (stats.size > 3000000) {
            console.log('file > 500000')
            ImageResizer.createResizedImage(data.uri, this.photoQuality, (this.photoQuality * 4) / 3, 'JPEG', 70)
              .then(({ uri }) => {
                this.setState({
                  spinner: false
                })
                this.props.navigation.navigate('ConfirmInfo', {
                  isCam: true,
                  filePath: uri,
                  typeTake: Constant.TYPE_TAKE_CAMERA,
                  flagCam: this.state.mFlagCam,
                  hasBack: this.state.mHasBack,
                  url: this.state.mUrl,
                  typeDocument: this.state.mTypeDocument
                })
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            this.setState({
              spinner: false
            })
            console.log('file < 500000')
            this.props.navigation.navigate('ConfirmInfo', {
              isCam: true,
              filePath: data.uri,
              typeTake: Constant.TYPE_TAKE_CAMERA,
              flagCam: this.state.mFlagCam,
              hasBack: this.state.mHasBack,
              url: this.state.mUrl,
              typeDocument: this.state.mTypeDocument
            })
          }
        })
        .catch((err) => { })
    }
  }

  renderCamera() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: '#313538', width: '100%', height: "10%" }} />
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
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}>
          {({ camera, status, recordAudioPermissionStatus }) => {
            if (status == 'NOT_AUTHORIZED') return <PendingView />;
          }}
        </RNCamera>
        <View
          style={{
            width: '100%',
            height: "15%",
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
    width: '100%',
    height: '75%',
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
