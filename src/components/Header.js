import React, { Component } from 'react';
import { ImageBackground, StyleSheet, Text ,View} from 'react-native'

const Header = ({ title }) => (
    <ImageBackground resizeMode="cover" source={require('../img/title_bg.png')} style={styles.imgBackground}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={styles.title}>{title}</Text>
        </View>
    </ImageBackground>
)

export default Header;

const styles = StyleSheet.create({
    imgBackground: {
        height: 60,
    },
    title: {
        fontSize: 20,
        color: "#fff",
        fontWeight: 'bold',

    }
})