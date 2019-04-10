import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native'
var ImagePicker = require('react-native-image-picker');

class ConfirmInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mFilePath: {},
        };
    }

    static navigationOptions = {
        header: null,
    };

    launchPickImage = () => {
        var options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                let source = response;
                this.setState({
                    mFilePath: source,
                });
            }
        });
    };
    render() {
        const { navigation } = this.props;
        mFilePath = navigation.getParam('filePath', '')
        const flagCam = navigation.getParam('flagCam', 1)
        const typeTake = navigation.getParam('typeTake', 1)

        return (
            <ScrollView>
                <View>
                    <Text style={styles.titleText}>{flagCam == 1 ? 'Ảnh chụp mặt trước' : 'Ảnh chụp mặt sau'}</Text>
                    <Image
                        source={{ uri: mFilePath.uri }}
                        style={styles.img}
                        resizeMode="cover"
                    />
                    <TouchableOpacity
                        style={styles.button}
                        underlayColor='#fff'>
                        <Text style={styles.buttonText}>Xác nhận thông tin</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.buttonTwo]}
                        underlayColor='#fff'
                        onPress={this.launchPickImage.bind(this)}>
                        <Text style={styles.buttonText}>Chọn lại</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    titleText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#695fd5',
        marginTop: 20,
        marginLeft: 15,
        marginRight: 15
    },
    img: {
        height: 400,
        margin: 20
    }, button: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#695fd5',
        borderRadius: 30,
        marginTop: 20,
        marginLeft: 15,
        marginRight: 15,
    },
    buttonTwo: {
        marginBottom: 20
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
    }
})

export default ConfirmInfo;