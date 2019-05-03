import React, { Component } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, Alert, Image} from 'react-native';
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
            mUrl: url,
        }
        console.log(this.state.mHasBack);
        console.log(this.state.mUrl);
    }

    launchPickImage = () => {
        var options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            noData: true
        };

        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                console.log('response', response)
                ImageResizer.createResizedImage(response.uri, 640, (640 * 4) / 3, 'JPEG', 70)
                    .then(({ uri }) => {
                        console.log('mHeight', response.height)
                        this.props.navigation.navigate('ConfirmInfo', {
                            isCam: false,
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
    }

    openPickImage() {
        Alert.alert(
            I18n.t('title_msg_front'),
            '',
            [
                {
                    text: 'OK', onPress: () => {
                        this.launchPickImage()
                    }
                },
            ]
        )
    }

    openCameraScreen = () => {
        Alert.alert(
            I18n.t('title_msg_take_front'),
            '',
            [
                {
                    text: 'OK', onPress: () => {
                        this.props.navigation.navigate('CameraScreen', {
                            flagCam: Constant.TYPE_FRONT,
                            hasBack: this.state.mHasBack,
                            url: this.state.mUrl
                        })
                    }
                },
            ]
        )
    }

    onError(error) {
        this.setState({ mImage: require('../img/image_not_found.png') })
    }

    render() {
        return (
            <View style={styles.container}>
                <Header title={I18n.t('title_method')} />
                <ImageBackground resizeMode="cover" source={require('../img/dangky_bg.png')} style={styles.imgBackground}>
                    <Image resizeMode="contain" source={{ uri: this.state.mImage, cache: 'force-cache' }} style={{ height: 250, width: '90%' }} onError={(e) => { this.props.source = { uri: '../img/image_not_found.png' } }} />
                    <TouchableOpacity
                        underlayColor='#fff'
                        onPress={this.openCameraScreen.bind(this)}>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#f33f5e', '#ab6f84']} style={styles.button}>
                            <Text style={styles.buttonText}>{I18n.t('method_pick')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                        underlayColor='#fff'
                        onPress={this.openPickImage.bind(this)}>
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
        paddingLeft: 50,
        paddingRight: 50
    },
})

export default ChooseMethod;