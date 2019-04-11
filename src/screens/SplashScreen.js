import React, { Component } from 'react';
import { ImageBackground, StyleSheet } from 'react-native'

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
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
})