import React, { Component } from 'react';
import { View, ImageBackground, StyleSheet, Alert } from 'react-native'
import Header from '../components/Header';
import GetDocument from "../actions/GetDocumentAction";
import I18n, { getLanguages } from 'react-native-i18n';
import NetInfo from '@react-native-community/netinfo';
I18n.fallbacks = true;

I18n.translations = {
    'en': require('../translation/en'),
    'ja': require('../translation/ja'),
}
class ChooseDocument extends Component {
    static navigationOptions = {
        header: null,
        isConnected: null
    };

    componentDidMount() {
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange,
        );
        NetInfo.isConnected.fetch().done(isConnected => {
            this.setState({ isConnected });
        });
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this._handleConnectivityChange,
        );
    }

    _handleConnectivityChange = isConnected => {
        if (!isConnected) {
            Alert.alert(
                I18n.t('title_not_connect'),
                I18n.t('title_try'),
                [
                    { text: 'OK', onPress: () => BackHandler.exitApp() },
                ]
            )
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <Header title={I18n.t('title_method')} />
                <ImageBackground resizeMode="cover" source={require('../img/dangky_bg.png')} style={styles.imgBackground}>
                    <GetDocument />
                </ImageBackground>
            </View>
        );
    }
}

export default ChooseDocument;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imgBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
})