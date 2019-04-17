import React, { Component } from 'react';
import { ImageBackground, StyleSheet, Alert, BackHandler } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
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
    state = {
        timePassed: false,
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
        if (isConnected) {
            setTimeout(() => {
                this.setTimePassed();
            }, 2000);
        }
        else {
            Alert.alert(
                I18n.t('title_not_connect'),
                I18n.t('title_try'),
                [
                    { text: 'OK', onPress: () => BackHandler.exitApp() },
                ]
            )
        }
    }
    
    setTimePassed() {
        this.setState({ timePassed: true });
    }

    render() {
        if (!this.state.timePassed) {
            return (
                <ImageBackground resizeMode="stretch" source={require('../img/splash_v2.png')} style={styles.imgBackground} />
            );
        } else {
            return (
                this.props.navigation.navigate('ChooseMethod')
            )
        }
    }
}

const styles = StyleSheet.create({
    imgBackground: {
        flex: 1,
    },
})