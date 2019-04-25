import React, { Component } from 'react';
import {StyleSheet, Text } from 'react-native'

const TitleText = ({ title , isHidden}) => (
    <Text style={isHidden ? styles.hidden : styles.title}>{title}</Text>
)

export default TitleText;

const styles = StyleSheet.create({
    title: {
        marginTop: 10,
        fontSize: 20,
        color: "#7e7e7e",
    },
    hidden: {
        width: 0,
        height: 0,
    },
})