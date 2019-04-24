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
import Permissions from 'react-native-permissions'

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
      };
      const data = await this.camera.takePictureAsync(options);
      this.setState({
        spinner: true
      })
      ImageResizer.createResizedImage(data.uri, this.photoQuality, (this.photoQuality * 4) / 3, 'JPEG', 70)
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
  }

  renderCamera() {
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
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}>
        <View style={StyleSheet.absoluteFill}>
          <View style={{ height: 50, backgroundColor: '#313538' }} />
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
            <Text style={styles.buttonText}>{this.state.mFlagCam == Constant.TYPE_FRONT ? I18n.t('title_take_front') : I18n.t('title_take_back')}</Text>
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
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 30,
    marginRight: 30,
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