import React, { Component } from 'react';
import { ImageBackground, StyleSheet, Button, Text, TouchableOpacity, Alert } from 'react-native'
var ImagePicker = require('react-native-image-picker');

class ChooseMethod extends Component {
    static navigationOptions = {
        header: null,
    };
    state = {
        filePath: {},
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
                    typeTake : 1,
                    flagCam: 1
                })
            }
        });
    };

    render() {
        return (
            <ImageBackground source={require('../img/bg_dangky.png')} style={styles.imgBackground}>
                <Text style={styles.titleText}>Đăng ký thông tin</Text>
                <TouchableOpacity
                    style={styles.button}
                    underlayColor='#fff'>
                    <Text style={styles.buttonText}>Chụp ảnh</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    underlayColor='#fff'
                    onPress={this.launchPickImage.bind(this)}>
                    <Text style={styles.buttonText}>Chọn ảnh</Text>
                </TouchableOpacity>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    imgBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        marginBottom: 36
    },
    titleText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#695fd5',
        marginBottom: 20
    },
    button: {
        marginTop: 20,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#695fd5',
        borderRadius: 30,
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