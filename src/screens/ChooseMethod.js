import React, { Component } from 'react';
import { ImageBackground, StyleSheet, Button, Text, TouchableOpacity } from 'react-native'

class ChooseMethod extends Component {
    static navigationOptions = {
        header: null,
    };
    state = {}
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
                    underlayColor='#fff'>
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
        color: '#695fd5'
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
        paddingLeft: 80,
        paddingRight: 80
    }
})

export default ChooseMethod;