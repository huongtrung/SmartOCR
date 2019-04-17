import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native'
import { View } from 'native-base';

const ContentText = ({ text }) => (
    <View>
        <Text style={styles.title}>{text}</Text>
        <View style={styles.view} />
    </View>
)

export default ContentText;

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        color: "black",
    },
    view: {
        marginTop: 5,
        height: 1,
        backgroundColor : '#70cdd1'
    }
})