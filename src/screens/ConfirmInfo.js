import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import Header from '../components/Header';
import I18n, { getLanguages } from 'react-native-i18n';

var ImagePicker = require('react-native-image-picker');
I18n.fallbacks = true;

I18n.translations = {
    'en': require('../translation/en'),
    'ja': require('../translation/ja'),
}
class ConfirmInfo extends Component {
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        mFilePath = navigation.getParam('filePath', ''),

        this.state = {
            mFilePath:  navigation.getParam('filePath', '')
        };

            console.log('file path', mFilePath)
    }

    componentWillMount() {
        getLanguages().then(languages => {
            this.setState({ languages });
        });
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
                console.log('respoonse', response)
            }
        });
    };

    render() {
        const { navigation } = this.props;
        const flagCam = navigation.getParam('flagCam', 1)
        const typeTake = navigation.getParam('typeTake', 1)

        return (
            <ScrollView>
                <View style={styles.container}>
                    <Header title={I18n.t('title_confirm_header')} />
                    <Text style={styles.titleText}>{flagCam == 1 ? I18n.t('title_image_front') : I18n.t('title_image_back')}</Text>
                    <Image
                        source={{ uri: this.state.mFilePath.uri }}
                        style={styles.img}
                        resizeMode="cover" />
                    <TouchableOpacity
                        style={styles.button}
                        underlayColor='#fff'>
                        <Text style={styles.buttonText}>{I18n.t('title_confirm')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.buttonTwo]}
                        underlayColor='#fff'
                        onPress={this.launchPickImage.bind(this)}>
                        <Text style={styles.buttonText}>{I18n.t('title_type')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#f33046',
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
        backgroundColor: '#f33046',
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