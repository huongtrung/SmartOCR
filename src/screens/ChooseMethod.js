import React, { Component } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, Alert, Image, ToastAndroid } from 'react-native';
import I18n, { getLanguages } from 'react-native-i18n';
import Header from '../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import ImageResizer from 'react-native-image-resizer';
import * as Constant from '../Constant';

var ImagePicker = require('react-native-image-picker');
I18n.fallbacks = true;

I18n.translations = {
    'en': require('../translation/en'),
    'ja': require('../translation/ja'),
}

class ChooseMethod extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        const { navigation } = this.props
        hasBack = navigation.getParam('hasBack', true)
        image = navigation.getParam('image', '')
        url = navigation.getParam('url', '')

        this.state = {
            filePath: {},
            mHasBack: hasBack,
            mImage: image,
            mUrl: url
        }
        console.log(this.state.mHasBack);
        console.log(this.state.mUrl);
    }

    launchPickImage = () => {
        ToastAndroid.show(I18n.t('title_msg_front'), ToastAndroid.SHORT);
        var options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            quality: 0.5
        };

        ImagePicker.launchImageLibrary(options, (response) => {
            console.log('fileSize', response.fileSize);
            console.log('path', response.path);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                ImageResizer.createResizedImage(response.uri, response.width, response.height, 'JPEG', 50)
                .then(({ uri }) => {
                    console.log(uri);
                    this.props.navigation.navigate('ConfirmInfo', {
                        filePath: uri,
                        typeTake: Constant.TYPE_TAKE_GALLERY,
                        flagCam: Constant.TYPE_FRONT,
                        hasBack: this.state.mHasBack,
                        url: this.state.mUrl
                    })
                })
                .catch(err => {
                    console.log(err);
                });
            }
        });
    };

    openCameraScreen = () => {
        this.props.navigation.navigate('CameraScreen', {
            flagCam: Constant.TYPE_FRONT,
            hasBack: this.state.mHasBack,
            url: this.state.mUrl
        })
    }

    onError(error) {
        this.setState({ mImage: require('../img/image_not_found.png') })
    }

    render() {
        return (
            <View style={styles.container}>
                <Header title={I18n.t('title_method')} />
                <ImageBackground resizeMode="cover" source={require('../img/dangky_bg.png')} style={styles.imgBackground}>
                    <Image source={{ uri: this.state.mImage }} style={{ height: 250, width: '90%', marginLeft: 30, marginRight: 30 }} onError={(e) => { this.props.source = { uri: '../img/image_not_found.png' } }} />
                    <TouchableOpacity
                        underlayColor='#fff'
                        onPress={this.openCameraScreen.bind(this)}>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#f33f5e', '#ab6f84']} style={styles.button}>
                            <Text style={styles.buttonText}>{I18n.t('method_pick')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                        underlayColor='#fff'
                        onPress={this.launchPickImage.bind(this)}>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#f33f5e', '#ab6f84']} style={styles.button}>
                            <Text style={styles.buttonText}>{I18n.t('method_choose')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        );
    }

    async onCheckCameraAuthoPressed() {
        const success = await CameraKitCamera.checkDeviceCameraAuthorizationStatus();
        if (success) {
            console.log('You have permission')
        }
        else {
            Alert.alert(I18n.t('title_permission_cam'))
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imgBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#f33046',
        marginTop: 20,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 30,
        marginLeft: 30,
        marginRight: 30,
    },

    buttonText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        paddingLeft: 100,
        paddingRight: 100
    }
})

export default ChooseMethod;