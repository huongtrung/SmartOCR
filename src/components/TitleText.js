import React, { Component } from 'react';
import {StyleSheet, Text } from 'react-native'

const TitleText = ({ title }) => (
    <Text style={styles.title}>{title}</Text>
)

export default TitleText;

const styles = StyleSheet.create({
    title: {
        marginTop: 10,
        fontSize: 20,
        color: "#7e7e7e",
    }
})