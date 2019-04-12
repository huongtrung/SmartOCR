import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView, BackHandler, ToastAndroid } from 'react-native';
import Header from '../components/Header';
import I18n, { getLanguages } from 'react-native-i18n';
import axios from 'react-native-axios';
import LinearGradient from 'react-native-linear-gradient';

var ImagePicker = require('react-native-image-picker');
I18n.fallbacks = true;

I18n.translations = {
    'en': require('../translation/en'),
    'ja': require('../translation/ja'),
}
class ConfirmInfo extends Component {
    constructor(props) {
        super(props);

        const { navigation } = this.props;
        filePath = navigation.getParam('filePath', ''),
            typeTake = navigation.getParam('typeTake', 1)

        this.state = {
            mFilePath: typeTake == 1 ? 'file://' + filePath.uri : filePath.uri,
        };
        console.log('filePath', filePath)

    }

    componentWillMount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        getLanguages().then(languages => {
            this.setState({ languages });
        });
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        ToastAndroid.show('Back button is pressed', ToastAndroid.SHORT);
        return true;
    }

    static navigationOptions = {
        header: null,
    };

    uploadImage = () => {
        const form = new FormData()
        form.append('image[image]', {
            name: 'image',
            uri: mFilePath,
            type: 'image/*'
        })
        form.append('encode', 1)
        const headers = {
            'Content-Type': 'multipart/form-data',
            'api-key': 'a08eb42a-4a57-449b-84f4-1f67219f2679'
        }
        return axios.post('http://150.95.109.122:8080/id/v1/recognition', form, { headers }).then(res => {
            console.log(res.data);
            console.log(res.status);
        })
            .catch(err => {
                console.log(err.message);
            });
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
                this.setState({
                    mFilePath: source.uri,
                });
                console.log('response', response)
            }
        });
    };

    handleBackButton = () => {
        if (this.props.isFocused) {
            Alert.alert(
                'Exit App',
                'Exiting the application?',
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel'
                    },
                    {
                        text: 'OK',
                        onPress: () => BackHandler.exitApp()
                    }
                ],
                {
                    cancelable: false
                }
            );
            return true;
        }
    };



    render() {
        const { navigation } = this.props;
        const flagCam = navigation.getParam('flagCam', 1)

        return (
            <ScrollView>
                <View style={styles.container}>
                    <Header title={I18n.t('title_confirm_header')} />
                    <Text style={styles.titleText}>{flagCam == 1 ? I18n.t('title_image_front') : I18n.t('title_image_back')}</Text>
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
                        onPress={this.launchPickImage.bind(this)}>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#f33f5e', '#ab6f84']} style={[styles.button, styles.buttonTwo]}>
                            <Text style={styles.buttonText}>{I18n.t('title_type')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>

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
        height: 400,
        margin: 20
    }, button: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#f33046',
        borderRadius: 30,
        marginTop: 20,
        marginLeft: 15,
        marginRight: 15,
    },
    buttonTwo: {
        marginBottom: 20
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
    }
})

export default ConfirmInfo;

