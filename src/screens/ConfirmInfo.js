import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView, BackHandler, Platform, Alert } from 'react-native';
import Header from '../components/Header';
import I18n, { getLanguages } from 'react-native-i18n';
import axios from 'react-native-axios';
import LinearGradient from 'react-native-linear-gradient';
import * as Constant from '../Constant';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import ImageResizer from 'react-native-image-resizer';
import Spinner from 'react-native-loading-spinner-overlay';
import ViewLoading from "../components/ViewLoading"
var ImagePicker = require('react-native-image-picker');
import RNFetchBlob from 'rn-fetch-blob';
I18n.fallbacks = true;

I18n.translations = {
    'en': require('../translation/en'),
    'ja': require('../translation/ja'),
}
class ConfirmInfo extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props
        isCam = navigation.getParam('isCam', false)
        filePath = navigation.getParam('filePath', '')
        typeTake = navigation.getParam('typeTake', Constant.TYPE_TAKE_CAMERA)
        flagCam = navigation.getParam('flagCam', Constant.TYPE_FRONT)
        hasBack = navigation.getParam('hasBack', true)
        url = navigation.getParam('url', '')
        typeDocument = navigation.getParam('typeDocument', 0)

        this.state = {
            mFilePath: filePath,
            mTypeTake: typeTake,
            mFlagCam: flagCam,
            mHasBack: hasBack,
            mUrl: url,
            spinner: false,
            mIsCam: isCam,
            mIsConnected: false,
            mTypeDocument: typeDocument
        };
        console.log('mTypeDocument', this.state.mTypeDocument)
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange.bind(this));
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    }

    handleConnectionChange = (isConnected) => {
        this.setState({
            mIsConnected: isConnected
        })
    }

    showMsgNotConnect() {
        Alert.alert(
            I18n.t('title_not_connect'),
            I18n.t('title_try'),
            [
                { text: 'OK', onPress: () => { console.log('OK Pressed') } },
            ]
        )
    }

    static navigationOptions = {
        title: I18n.t('title_confirm_header')
    };

    checkNetwork() {
        console.log(this.state.mIsConnected)
        if (this.state.mIsConnected) {
            this.uploadImage()
        } else {
            this.showMsgNotConnect()
        }
    }

    uploadImage = () => {
        this.setState({
            spinner: true
        });
        const form = new FormData()
        form.append('image', {
            name: 'image',
            uri: this.state.mFilePath,
            type: 'image/*'
        })
        if (this.state.mTypeDocument != 5) {
            form.append('encode', 1)
        }
        const headers = {
            'Content-Type': 'multipart/form-data',
            'api-key': Constant.API_KEY
        }
        return axios.post(this.state.mUrl, form, { headers }).then(res => {
            this.setState({
                spinner: false
            });
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
                }
                else if (res.data.ErrorMessageId == 'Error text line detection (size of img is smaller than 3) : 0') {
                    Alert.alert(
                        I18n.t('title_not_detect'),
                        '',
                        [
                            { text: 'OK', onPress: () => { } },
                        ]
                    )
                }
                else {
                    if (res.data.front_flg == 1) {
                        AsyncStorage.setItem(Constant.DATA_BACK, JSON.stringify(res.data), () => { });
                        AsyncStorage.setItem(Constant.IMG_BACK, this.state.mFilePath);
                    } else {
                        AsyncStorage.setItem(Constant.DATA_FRONT, JSON.stringify(res.data), () => { });
                        AsyncStorage.setItem(Constant.IMG_FRONT, this.state.mFilePath);
                    }
                    switch (this.state.mFlagCam) {
                        case Constant.TYPE_FRONT:
                            if (this.state.mHasBack) {
                                this.setState({
                                    mFlagCam: Constant.TYPE_BACK
                                })
                                if (this.state.mTypeTake == Constant.TYPE_TAKE_CAMERA) {
                                    console.log("TYPE TAKE ===> ", this.state.mTypeTake)
                                    this.gotoCameraScreen()
                                } else {
                                    this.openPickImage()
                                }
                            } else {
                                console.log(this.state.mTypeDocument)
                                this.props.navigation.navigate('InfoDocumentScreen', {
                                    hasBack: this.state.mHasBack,
                                    isCam: this.state.mIsCam,
                                    typeDocument: this.state.mTypeDocument
                                })
                            }
                            break;
                        case Constant.TYPE_BACK:
                            this.props.navigation.navigate('InfoDocumentScreen', {
                                isCam: this.state.mIsCam,
                                typeDocument: this.state.mTypeDocument
                            })
                            break;
                    }
                }
            } else {
                this.errorAlert()
            }

        })
            .catch(err => {
                console.log(err);
                this.setState({
                    spinner: false
                });
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
        Alert.alert(
            I18n.t('title_msg_take_back'),
            '',
            [
                {
                    text: 'OK', onPress: () => {
                        this.props.navigation.navigate('CameraScreen', {
                            flagCam: Constant.TYPE_BACK,
                            hasBack: this.state.mHasBack,
                            url: this.state.mUrl,
                            typeDocument: this.state.mTypeDocument
                        })
                    }
                },
            ]
        )
    }

    openPickImage() {
        var msg = '';
        if (this.state.mTypeTake == Constant.TYPE_TAKE_CAMERA) {
            if (this.state.mFlagCam == Constant.TYPE_FRONT) {
                msg = I18n.t('title_msg_take_front')
            } else {
                msg = I18n.t('title_msg_take_back')
            }
        } else {
            if (this.state.mFlagCam == Constant.TYPE_FRONT) {
                msg = I18n.t('title_msg_front')
            } else {
                msg = I18n.t('title_msg_back')
            }
        }
        Alert.alert(
            msg,
            '',
            [
                {
                    text: 'OK', onPress: () => {
                        if (this.state.mTypeTake == Constant.TYPE_TAKE_CAMERA) {
                            this.props.navigation.navigate('CameraScreen', {
                                flagCam: this.state.mFlagCam,
                                hasBack: this.state.mHasBack,
                                url: this.state.mUrl,
                                typeDocument: this.state.mTypeDocument
                            })
                        } else {
                            this.setState({
                                mFilePath: ''
                            })
                            this.launchPickImage()
                        }
                    }
                },
            ]
        )
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
                if (Platform.OS === "ios") {
                    response.uri = response.uri.replace("file://", "");
                }
                RNFetchBlob.fs.stat(response.uri)
                    .then((stats) => {
                        console.log(stats)
                        if (stats.size > 3000000) {
                            ImageResizer.createResizedImage(response.uri, 640, (640 * 4) / 3, 'JPEG', 70)
                                .then(({ uri }) => {
                                    console.log(uri);
                                    this.setState({
                                        mFilePath: uri,
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        } else {
                            this.setState({
                                mFilePath: response.uri,
                            });
                        }
                    })
                    .catch((err) => { })

            }
        });
    };

    takeAgain() {
        this.openPickImage()
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    {/* <Header title={I18n.t('title_confirm_header')} /> */}
                    <View style={{
                        marginLeft: 15,
                        marginRight: 15,
                    }}>
                        <Text style={styles.titleText}>{this.state.mFlagCam == Constant.TYPE_FRONT ? I18n.t('title_image_front') : I18n.t('title_image_back')}</Text>
                        <Image
                            source={{ uri: this.state.mFilePath }}
                            style={styles.img}
                            resizeMode="contain"
                        />
                    </View>
                </View>
                <View style={styles.bottomView}>
                    <TouchableOpacity
                        underlayColor='#fff'
                        onPress={this.checkNetwork.bind(this)}>
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
                </View>
                {/* <Spinner
                    visible={this.state.spinner}
                    color="#f33f5e"
                    // cancelable={true}
                /> */}
                {this.state.spinner ? <ViewLoading /> : null}
            </View>
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
        marginTop: 5,
        marginBottom: 5,
    },
    img: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
    },
    button: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#f33046',
        borderRadius: 30,
        marginTop: 10,
        marginLeft: 70,
        marginRight: 70,
    },
    buttonTwo: {
        marginBottom: 20
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
    },
    spinnerTextStyle: {
        color: '#fff'
    },
    bottomView: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 15
    },
})

export default ConfirmInfo;

