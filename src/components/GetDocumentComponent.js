import React, { Component } from 'react';
import { StyleSheet, Text, View, ListView, Image, Alert, List, FlatList } from 'react-native';

export default class GetDocument extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dataVN: [],
        }
    }

    componentDidMount() {
        this.props.callGetChoose()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data != null) {
            console.log('the state', nextProps);
            console.log('list', nextProps.data.document);
            this.setState({
                data: nextProps.data.document,
            });
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

    render() {
        return (
            <FlatList
                data={this.state.data}
                renderItem={({ item }) => (
                    <View style={{ backgroundColor: 'white' }}>
                        <Text>{item.id}</Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF'
    },
    containerText: {
        flexDirection: 'column',
    },
    containerList: {
        flex: 1,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        marginLeft: 12,
        fontSize: 16,
    },
    text: {
        marginLeft: 12,
        fontSize: 12,
    },
    photo: {
        height: 80,
        width: 80,
        borderRadius: 20,
        backgroundColor: '#000000'
    },

    centering: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
});


