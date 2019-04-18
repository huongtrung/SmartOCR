import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Alert, List, FlatList } from 'react-native';
import I18n, { getLanguages } from 'react-native-i18n';
I18n.fallbacks = true;

I18n.translations = {
    'en': require('../translation/en'),
    'ja': require('../translation/ja'),
}
export default class GetDocument extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        this.props.callGetChoose()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data != null) {
            console.log('list', nextProps.data.document);
            this.setState({
                data: nextProps.data.document,
            });
            console.log('DATA', nextProps.data.document);
            console.log('DATA',this.state.data);
        }
        if (nextProps.error != undefined) {
            Alert.alert(
                'Error',
                nextProps.error,
                [
                    { text: 'Do you want to reload', onPress: () => this.props.callGetChoose() },
                ],
                { cancelable: false })
        }
    }

    // prepData = () => {
    //     let dataVN  = []
    //     for (let i = 0; i < this.state.data.length; i++) {
    //         dataVN.push(this.state.data[i])
    //     }
    //     return dataVN
    //   }
    
    //   renderItem = ({ item }) => {
    //     return (
    //       <View style={styles.item} key={item.id}>
    //         <Text>{item.name}</Text>
    //       </View>
    //     )
    //   }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.containerRow}>
                    <Text style={styles.textLang}>{I18n.t('title_vn')}</Text>
                    {/* {this.prepData().map((item) => this.renderItem({ item }))} */}
                </View>
                <View style={styles.containerRow} >
                    <Text style={styles.textLang}>{I18n.t('title_jp')}</Text>
                    {/* {this.prepData().map((item) => this.renderItem({ item }))} */}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerRow: {
        flex: 1,
    },
    textLang: {
        textAlign: 'center',
    }
});


