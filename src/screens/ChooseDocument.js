import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Alert, Text, Button, TouchableOpacity } from 'react-native'
import Header from '../components/Header';
import GetDocument from "../actions/GetDocumentAction";
import I18n, { getLanguages } from 'react-native-i18n';
import NetInfo from '@react-native-community/netinfo';
import axios from 'react-native-axios';
import * as Constant from '../Constant';
import Loading from 'react-native-whc-loading'
import LinearGradient from 'react-native-linear-gradient';


I18n.fallbacks = true;

I18n.translations = {
    'en': require('../translation/en'),
    'ja': require('../translation/ja'),
}
class ChooseDocument extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    componentWillMount() {
        this.getDocumentAPI()
    }
    componentDidMount() {
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange,
        );
        NetInfo.isConnected.fetch().done(isConnected => {
            this.setState({ isConnected });
        });
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this._handleConnectivityChange,
        );
    }

    _handleConnectivityChange = isConnected => {
        if (!isConnected) {
            Alert.alert(
                I18n.t('title_not_connect'),
                I18n.t('title_try'),
                [
                    { text: 'OK', onPress: () => BackHandler.exitApp() },
                ]
            )
        }
    };

    getDocumentAPI = () => {
        axios.get('http://150.95.110.70:3000/listDocument', { headers: { api_key: Constant.API_KEY } })
            .then(response => {
                console.log('response', response.data);
                this.setState({
                    data: response.data.document
                })
            })
            .catch(error => {
                console.log('error', error);
            });
    }

    prepDataVN = () => {
        let dataVN = []
        for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].language == 'VN') {
                dataVN.push(this.state.data[i])
            }
        }
        console.log('dataVN', dataVN)
        return dataVN
    }

    prepDataJP = () => {
        let dataJP = []
        for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].language == 'JP') {
                dataJP.push(this.state.data[i])
            }
        }
        console.log('dataJP', dataJP)
        return dataJP
    }

    renderItemVN = ({ item }) => {
        return (
            <TouchableOpacity key={item.id}
                style={styles.button}
                underlayColor='#fff'>
                    <Text style={styles.buttonText}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    renderItemJP = ({ item }) => {
        return (
            <View key={item.id}>
                <Button
                    style={styles.button}
                    title={item.name}
                    color="#34aab7" />
            </View>
        )
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.containerView}>
                    <Header title={I18n.t('title_doc')} />
                    <View style={styles.container}>
                        <View style={styles.containerRow}>
                            <Text style={styles.textLang}>{I18n.t('title_vn')}</Text>
                            {this.prepDataVN().map((item) => this.renderItemVN({ item }))}
                        </View>
                        <View style={styles.containerRow} >
                            <Text style={styles.textLang}>{I18n.t('title_jp')}</Text>
                            <View style={{ width: 200, height: 200 }}>
                                {this.prepDataJP().map((item) => this.renderItemJP({ item }))}
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

export default ChooseDocument;

const styles = StyleSheet.create({
    containerView: {
        flex: 1
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
        marginBottom : 20
    },
    button: {
        backgroundColor: '#f33046',
        paddingTop: 5,
        paddingBottom: 5,
        marginLeft : 10,
        marginRight : 10,
        marginBottom : 10
    },

    buttonText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    }
})