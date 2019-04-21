import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Image, Text, TouchableOpacity } from 'react-native'
import I18n, { getLanguages } from 'react-native-i18n';
import Header from '../components/Header';
import TitleText from '../components/TitleText';
import ContentText from '../components/ContentText';
import LinearGradient from 'react-native-linear-gradient';
import * as Constant from '../Constant';
import AsyncStorage from '@react-native-community/async-storage';

I18n.translations = {
    'en': require('../translation/en'),
    'ja': require('../translation/ja'),
}

class InfoDocumentScreen extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
            mFileFrontPath: '',
            mFileBackPath: '',
            mName: '',
            mID: '',
            mCreateAt: '',
            mCreateDate: '',
            mBirthday: '',
            mSex: '',
            mCountry: '',
            mAddress: '',
        }
    }

    confirmAgain = () => {
        this.props.navigation.navigate('ChooseMethod')
    }

    componentWillMount() {
        console.log('componentWillMount')
        getLanguages().then(languages => {
            this.setState({ languages });
        });
        AsyncStorage.getItem(Constant.DATA_FRONT, (err, result) => {
            try {
                let frontObj = JSON.parse(result);
                console.log(frontObj.name);
                this.setState({
                    mName: frontObj.name,
                    mID: frontObj.id,
                    mBirthday: frontObj.birthday,
                    mSex: frontObj.sex,
                    mAddress: frontObj.address
                })
            } catch (ex) {
                console.error(ex);
            }
        });
        AsyncStorage.getItem(Constant.DATA_BACK, (err, result) => {
            try {
                let backObj = JSON.parse(result);
                let issueAt = backObj.issue_at
                if (issueAt == null && issueAt == '' && issueAt.includes('N/A')) {
                    issueAt = 'Công an Hà Nội'
                }
                this.setState({
                    mCreateAt: issueAt,
                    mCreateDate: backObj.issue_date
                })

            } catch (ex) {
                console.error(ex);
            }
        });
        AsyncStorage.getItem(Constant.IMG_BACK, (err, result) => {
            this.setState({
                mFileBackPath: result
            })
            console.log(result);
        });
        AsyncStorage.getItem(Constant.IMG_FRONT, (err, result) => {
            try {
                this.setState({
                    mFileFrontPath: result
                })
                console.log(result);
            } catch (ex) {
                console.error(ex);
            }
        });
    }

    componentWillUnmount() {
        console.log('componentWillUnMount')
        let keys = [Constant.DATA_FRONT, Constant.DATA_BACK, Constant.IMG_BACK, Constant.IMG_FRONT];
        AsyncStorage.multiRemove(keys, (err) => {
            console.log('remove')
        });
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Header title={I18n.t('title_info_header')} />
                    <View style={styles.containerDoc}>
                        <Text style={styles.titleText}>{I18n.t('title_image_front')}</Text>
                        <Image
                            source={{ uri: this.state.mFileFrontPath }}
                            style={[styles.img, styles.marginBottom]}
                            resizeMode="cover" />
                        <Text style={styles.titleText}>{I18n.t('title_image_back')}</Text>
                        <Image
                            source={{ uri: this.state.mFileBackPath }}
                            style={[styles.img, styles.marginBottom]}
                            resizeMode="cover" />
                        <TitleText title={I18n.t('title_name')} />
                        <ContentText text={this.state.mName} />

                        <TitleText title={I18n.t('title_id')} />
                        <ContentText text={this.state.mID} />

                        <TitleText title={I18n.t('title_create_date')} />
                        <ContentText text={this.state.mCreateDate} />

                        <TitleText title={I18n.t('title_create_at')} />
                        <ContentText text={this.state.mCreateAt} />

                        <TitleText title={I18n.t('title_birthday')} />
                        <ContentText text={this.state.mBirthday} />

                        <TitleText title={I18n.t('title_sex')} />
                        <ContentText text={this.state.mSex} />

                        <TitleText title={I18n.t('title_address')} />
                        <ContentText text={this.state.mAddress} />

                        <TouchableOpacity
                            style={{ marginBottom: 20 }}
                            underlayColor='#fff'
                            onPress={this.confirmAgain.bind(this)}>
                            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#f33f5e', '#ab6f84']} style={[styles.button, styles.buttonTwo]}>
                                <Text style={styles.buttonText}>
                                    {this.state.mTypeTake == Constant.TYPE_TAKE_CAMERA ? I18n.t('title_take_again') : I18n.t('title_choose_again')}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerDoc: {
        flex: 1,
        marginLeft: 15,
        marginRight: 15
    },
    img: {
        height: 400,
    },
    marginBottom: {
        marginBottom: 10
    },
    titleText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#f33046',
        marginTop: 10,
        marginBottom: 10
    },
    button: {
        backgroundColor: '#f33046',
        marginTop: 20,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 30,
        marginLeft: 30,
        marginRight: 30,
    },

    buttonText: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        paddingLeft: 100,
        paddingRight: 100
    }
})

export default InfoDocumentScreen;