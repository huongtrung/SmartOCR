import React, { Component } from 'react';
import { StyleSheet, Text, View, ListView, Image, ActivityIndicator, Alert } from 'react-native';

export default class Index extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        }
    }

    componentDidMount() {
        this.props.callService()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data != null) {
            console.log('the state', nextProps);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(nextProps.data)
            });
        }

        if (nextProps.error != undefined) {
            Alert.alert(
                'Error',
                nextProps.error,
                [
                    { text: 'Do you want to reload', onPress: () => this.props.callService() },
                ],
                { cancelable: false })
        }
    }

    renderCell = (rowData) => (
        <View style={styles.containerList}>
            <Image source={{ uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png' }} style={styles.photo} />
            <View style={styles.containerText}>
            <Text style={styles.text}>
                {`${rowData.title}`}
            </Text>
            <Text style={styles.text}>
                {`${rowData.pubDate}`}
            </Text>
            </View>
        </View>
    );

    render() {
        const { dataSource, isLoading } = this.state;
        console.log(dataSource);
        return (
            <View style={styles.container}>
                <ListView
                    style={{ marginTop: 30, flex: 1 }}
                    dataSource={dataSource}
                    renderRow={(rowData) => this.renderCell(rowData)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF'
    },
    containerText:{
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
