import React, { Component } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, NetInfo, Alert } from 'react-native'
import I18n, { getLanguages } from 'react-native-i18n';
import Header from '../components/Header'

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
                    typeTake: 1,
                    flagCam: 1
                })
            }
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <Header title={I18n.t('title_method')} />
                <ImageBackground source={require('../img/bg_dangky.png')} style={styles.imgBackground}>
                    <TouchableOpacity
                        underlayColor='#fff'
                        style={styles.button}>
                        <Text style={styles.buttonText}>{I18n.t('method_pick')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        underlayColor='#fff'
                        style={styles.button}
                        onPress={this.launchPickImage.bind(this)}>
                        <Text style={styles.buttonText}>{I18n.t('method_choose')}</Text>
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        );
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