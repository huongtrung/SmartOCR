import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Alert, Text, TouchableOpacity, Linking, BackHandler, Platform } from 'react-native'
import Header from '../components/Header';
import I18n, { getLanguages } from 'react-native-i18n';
import NetInfo from '@react-native-community/netinfo';
import axios from 'react-native-axios';
import * as Constant from '../Constant';
import Spinner from 'react-native-loading-spinner-overlay';
I18n.fallbacks = true;

I18n.translations = {
    'en': require('../translation/en'),
    'ja': require('../translation/ja'),
}
class ChooseDocument extends Component {
    static navigationOptions = {
        title: I18n.t('title_doc'),
        gesturesEnabled: false
    };
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            webPage: '',
            lang: '',
            spinner: false,
            mIsNotConnected: false,
        }
    }

    componentWillMount() {
        getLanguages().then(languages => {
            this.setState({
                lang: languages[0]
            })
            console.log('languages[0]', this.state.lang)
        });
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange.bind(this));

        // this.getDocumentAPI()

    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    }

    handleConnectionChange = (isConnected) => {
        if (!isConnected) {
            this.setState({
                mIsNotConnected: true,
            })
            if (!this.alertPresent) {
                this.alertPresent = true
                Alert.alert(
                    I18n.t('title_not_connect'),
                    I18n.t('title_try'),
                    [{
                        text: 'OK',
                        onPress: () => { }
                    },]
                )
                console.log("isERRORALERTHANDLE ===> ")
            } else {
                this.alertPresent = false
            }

        } else {
            this.setState({
                mIsNotConnected: false,
            })
            this.getDocumentAPI()
        }
    }

    getDocumentAPI = () => {
        if (!this.state.mIsNotConnected) {
            this.setState({
                spinner: true
            })
            axios.get('https://tenten.smartocr.vn/listDocument', { headers: { 'api-key': Constant.API_KEY } })
                .then(response => {
                    this.setState({
                        spinner: false
                    })
                    if (response.data.result_code == Constant.RESULT_OK) {
                        console.log('response', response.data);
                        this.setState({
                            webPage: response.data.web_page,
                            data: response.data.document
                        })
                    } else {
                        this.errorAlert()
                        console.log("isERRORALERT ===> ")
                    }
                })
                .catch(error => {
                    this.setState({
                        spinner: false
                    })
                    this.errorAlert()
                    console.log('error', error);
                });
        }
    }

    errorAlert() {
        Alert.alert(
            I18n.t('title_error'),
            I18n.t('title_msg'),
            [
                { text: 'OK', onPress: () => { } },
            ]
        )
    }

    prepDataVN = () => {
        let dataVN = []
        for (let i = 0; i < this.state.data.length; i++) {
            if (Platform.OS === 'ios') {
                if (this.state.data[i].language == 'VN' && this.state.data[i].active) {
                    dataVN.push(this.state.data[i])
                }
            } else {
                if (this.state.data[i].language == 'VN') {
                    dataVN.push(this.state.data[i])
                }
            }

        }
        return dataVN
    }

    prepDataJP = () => {
        let dataJP = []
        for (let i = 0; i < this.state.data.length; i++) {
            if (Platform.OS === 'ios') {
                if (this.state.data[i].language == 'JP' && this.state.data[i].active) {
                    dataJP.push(this.state.data[i])
                }
            } else {
                if (this.state.data[i].language == 'JP') {
                    dataJP.push(this.state.data[i])
                }
            }
        }
        return dataJP
    }

    renderItemVN = ({ item }) => {
        return (
            <TouchableOpacity key={item.id}
                onPress={() => this.chooseItemDocument(item)}
                style={styles.button}
                underlayColor='#fff'>
                <Text style={styles.buttonText}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    renderItemJP = ({ item }) => {
        return (
            <TouchableOpacity key={item.id}
                onPress={() => this.chooseItemDocument(item)}
                style={styles.buttonJP}
                underlayColor='#fff'>
                <Text style={styles.buttonTextJP}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    chooseItemDocument = (item) => {
        if (item.active) {
            console.log('type', item.id)
            this.props.navigation.navigate('ChooseMethod', {
                hasBack: item.has_back,
                image: item.image,
                url: item.url,
                typeDocument: item.id
            })
        } else {
            Alert.alert(
                this.setErrorMsg(item),
                '',
                [
                    { text: 'OK', onPress: () => { } },
                ]
            )
        }
    }

    setErrorMsg = (item) => {
        switch (this.state.lang) {
            case 'vi-VN':
                console.log('vi-VN')
                return item.inactive_msg
            case 'ja-JP':
                console.log('ja-JP')
                return item.inactive_msg_jp
            default:
                console.log('default')
                return item.inactive_msg_en
        }
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ScrollView>
                    <View style={styles.containerView}>
                        {/* <Header title={I18n.t('title_doc')} /> */}
                        <View style={styles.container}>
                            <View style={styles.containerRow}>
                                <Text style={[styles.textLang, !this.prepDataVN().length ? styles.hidden : {}]}>{I18n.t('title_vn')}</Text>
                                {this.prepDataVN().map((item) => this.renderItemVN({ item }))}
                            </View>
                            <View style={styles.containerRow} >
                                <Text style={[styles.textLang, !this.prepDataJP().length ? styles.hidden : {}]}>{I18n.t('title_jp')}</Text>
                                {this.prepDataJP().map((item) => this.renderItemJP({ item }))}
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.bottomView}>
                    <Text onPress={() => { Linking.openURL(this.state.webPage) }} style={styles.textInfo}>{I18n.t('title_info')}</Text>
                </View>

                <Spinner
                    visible={this.state.spinner}
                    color="#f33f5e"
                    cancelable={true}
                />
                {!this.prepDataVN().length || !this.prepDataJP().length ? <Text style={{ position: "absolute", alignSelf: "center" }}>{I18n.t('title_not_connect')}</Text> : null}
            </View>
        );
    }
}

export default ChooseDocument;

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 50
    },
    containerRow: {
        flex: 1,
    },
    textLang: {
        fontSize: 25,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20
    },
    button: {
        backgroundColor: '#dc6c6b',
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonJP: {
        backgroundColor: '#34aab7',
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
    buttonTextJP: {
        color: '#fff',
        fontSize: 18,
        ...Platform.select({
            ios: {
                paddingTop: 1.5,
                paddingBottom: 1.5
            }
        }),
        textAlign: 'center',
    },
    bottomView: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 15
    },
    textInfo: {
        width: '100%',
        textAlign: 'center',
        fontSize: 18,
        textDecorationLine: 'underline',
    }, hidden: {
        width: 0,
        height: 0,
    },

})