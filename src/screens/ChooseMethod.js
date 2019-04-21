import React, { Component } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import I18n, { getLanguages } from 'react-native-i18n';
import Header from '../components/Header';
import LinearGradient from 'react-native-linear-gradient';
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
        var options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                let source = response;
                this.props.navigation.navigate('ConfirmInfo', {
                    filePath: source,
                    typeTake: Constant.TYPE_TAKE_GALLERY,
                    flagCam: Constant.TYPE_FRONT,
                    hasBack: this.state.mHasBack,
                    url: this.state.mUrl
                })
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

    render() {
        return (
            <View style={styles.container}>
                <Header title={I18n.t('title_method')} />
                <ImageBackground resizeMode="cover" source={require('../img/dangky_bg.png')} style={styles.imgBackground}>
                    <Image source={require('../img/image_not_found.png')} style={{ height: 250,width : 300 }} />
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