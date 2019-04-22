import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView, BackHandler, ToastAndroid, Alert } from 'react-native';
import Header from '../components/Header';
import I18n, { getLanguages } from 'react-native-i18n';
import axios from 'react-native-axios';
import LinearGradient from 'react-native-linear-gradient';
import Loading from 'react-native-whc-loading'
import * as Constant from '../Constant';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import ImageResizer from 'react-native-image-resizer';

var ImagePicker = require('react-native-image-picker');
I18n.fallbacks = true;

I18n.translations = {
    'en': require('../translation/en'),
    'ja': require('../translation/ja'),
}
class ConfirmInfo extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props
        filePath = navigation.getParam('filePath', '')
        typeTake = navigation.getParam('typeTake', Constant.TYPE_TAKE_CAMERA)
        flagCam = navigation.getParam('flagCam', Constant.TYPE_FRONT)
        hasBack = navigation.getParam('hasBack', true)
        url = navigation.getParam('url', '')

        this.state = {
            mFilePath: filePath,
            mTypeTake: typeTake,
            mFlagCam: flagCam,
            mHasBack: hasBack,
            mUrl: url
        };

        console.log('filePath', filePath)
        console.log('mTypeTake', typeTake)
        console.log('mFlagCam', flagCam)
        console.log('mHasBack', hasBack)
        console.log('mUrl', url)
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange.bind(this));
        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ isConnected: isConnected }); }
        );
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    }

    handleConnectionChange = (isConnected) => {
        if (!isConnected) {
            Alert.alert(
                I18n.t('title_not_connect'),
                I18n.t('title_try'),
                [
                    { text: 'OK', onPress: () => BackHandler.exitApp() },
                ]
            )
        }
    }

    static navigationOptions = {
        header: null,
    };

    uploadImage = () => {
        this.refs.loading.show();
        const form = new FormData()
        form.append('image', {
            name: 'image',
            uri: this.state.mFilePath,
            type: 'image/*'
        })
        form.append('encode', 1)
        const headers = {
            'Content-Type': 'multipart/form-data',
            'api-key': Constant.API_KEY
        }
        return axios.post(this.state.mUrl, form, { headers }).then(res => {
            this.refs.loading.close();
            console.log(res.data);
            console.log(res.status);
            if (res.status == Constant.RESULT_OK) {
                if (res.data.front_flg == -1) {
                    Alert.alert(
                        I18n.t('title_error_pick'),
                        I18n.t('title_msg'),
                        [
                            { text: 'OK', onPress: () => { } },
                        ]
                    )
                } else {
                    switch (this.state.mFlagCam) {
                        case Constant.TYPE_FRONT:
                            AsyncStorage.setItem(Constant.DATA_FRONT, JSON.stringify(res.data), () => { });
                            AsyncStorage.setItem(Constant.IMG_FRONT, this.state.mFilePath);
                            if (this.state.mHasBack) {
                                this.setState({
                                    mFlagCam: Constant.TYPE_BACK
                                })
                                if (this.state.mTypeTake == Constant.TYPE_TAKE_CAMERA) {
                                    this.gotoCameraScreen()
                                } else {
                                    this.launchPickImage()
                                }
                            } else {
                                this.props.navigation.navigate('InfoDocumentScreen')
                            }
                            break;
                        case Constant.TYPE_BACK:
                            AsyncStorage.setItem(Constant.DATA_BACK, JSON.stringify(res.data), () => { });
                            AsyncStorage.setItem(Constant.IMG_BACK, this.state.mFilePath);
                            this.props.navigation.navigate('InfoDocumentScreen')
                            break;
                    }
                }
            } else {
                this.errorAlert()
            }

        })
            .catch(err => {
                console.log(err);
                this.refs.loading.close();
                this.errorAlert()
            });
    }

    errorAlert() {
        Alert.alert(
            I18n.t('title_error'),
            I18n.t('title_msg'),
            [
                { text: 'OK', onPress: () => { } },
            ]
        )
    }

    gotoCameraScreen() {
        this.props.navigation.navigate('CameraScreen', {
            flagCam: Constant.TYPE_BACK,
            hasBack: this.state.mHasBack,
            url: this.state.mUrl
        })
    }

    launchPickImage = () => {
        if (this.state.mFlagCam == Constant.TYPE_FRONT) {
            ToastAndroid.show(I18n.t('title_msg_front'), ToastAndroid.SHORT);
        } else {
            ToastAndroid.show(I18n.t('title_msg_back'), ToastAndroid.SHORT);
        }
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
                ImageResizer.createResizedImage(response.uri, response.width, response.height, 'JPEG', 50)
                    .then(({ uri }) => {
                        console.log(uri);
                        this.setState({
                            mFilePath: uri,
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    });
                console.log('response', response)
            }
        });
    };

    takeAgain() {
        switch (this.state.mTypeTake) {
            case Constant.TYPE_TAKE_CAMERA:
                console.log('this.state.flagCam', this.state.mFlagCam)
                console.log('this.state.mHasBack', this.state.mHasBack)
                console.log('this.state.mUrl', this.state.mUrl)

                this.props.navigation.navigate('CameraScreen', {
                    flagCam: this.state.mFlagCam,
                    hasBack: this.state.mHasBack,
                    url: this.state.mUrl
                })
                break;
            case Constant.TYPE_TAKE_GALLERY:
                this.launchPickImage()
                break;
        }
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Header title={I18n.t('title_confirm_header')} />
                    <Text style={styles.titleText}>{this.state.mFlagCam == Constant.TYPE_FRONT ? I18n.t('title_take_front') : I18n.t('title_take_back')}</Text>
                    <Image
                        source={{ uri: this.state.mFilePath }}
                        style={styles.img}
                        resizeMode="cover" />
                    <TouchableOpacity
                        underlayColor='#fff'
                        onPress={this.uploadImage.bind(this)}>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#f33f5e', '#ab6f84']} style={styles.button}>
                            <Text style={styles.buttonText}>{I18n.t('title_confirm')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        underlayColor='#fff'
                        onPress={this.takeAgain.bind(this)}>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#f33f5e', '#ab6f84']} style={[styles.button, styles.buttonTwo]}>
                            <Text style={styles.buttonText}>
                                {this.state.mTypeTake == Constant.TYPE_TAKE_CAMERA ? I18n.t('title_take_again') : I18n.t('title_choose_again')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <Loading ref='loading' indicatorColor='#f33f5e' backgroundColor='transparent' />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#f33046',
        marginTop: 20,
        marginLeft: 15,
        marginRight: 15
    },
    img: {
        width: '90%',
        height: 450,
        margin: 20
    }, button: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#f33046',
        borderRadius: 30,
        marginTop: 20,
        marginLeft: 30,
        marginRight: 30,
    },
    buttonTwo: {
        marginBottom: 20
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
    },
})

export default ConfirmInfo;

