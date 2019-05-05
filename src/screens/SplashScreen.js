import React, { Component } from 'react';
import { ImageBackground, StyleSheet, Alert, BackHandler, Image } from 'react-native';
import I18n, { getLanguages } from 'react-native-i18n';

I18n.fallbacks = true;

I18n.translations = {
    'en': require('../translation/en'),
    'ja': require('../translation/ja'),
}

export default class SplashScreen extends Component {
    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
        setTimeout(() => {
            this.props.navigation.navigate('ChooseDocument')
        }, 2000);
    }

    render() {
        return (
            <ImageBackground resizeMode="stretch" source={require('../img/splash_v2.png')} style={styles.imgBackground}>
                <Image resizeMode="contain" style={{ width: 200, height: 50 }} source={require('../img/logo_splash.png')} />
            </ImageBackground>
        );

    }
}

const styles = StyleSheet.create({
    imgBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})