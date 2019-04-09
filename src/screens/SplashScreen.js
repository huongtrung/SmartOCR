import React, { Component } from 'react';
import { ImageBackground, Alert, Text, StyleSheet, Image } from 'react-native'

export default class SplashScreen extends Component {
    static navigationOptions = {
        header: null,
    };
    state = {
        timePassed: false,
    }
    componentDidMount() {
        setTimeout(() => {
            this.setTimePassed();
        }, 3000);
    }
    setTimePassed() {
        this.setState({ timePassed: true });
    }

    render() {
        if (!this.state.timePassed) {
            return (
                <ImageBackground source={require('../img/splash.png')} style={styles.imgBackground}>
                    <Image source={require('../img/logo.png')} style={styles.logo} />
                </ImageBackground>
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
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    logo: {
        marginBottom: 36
    }
})