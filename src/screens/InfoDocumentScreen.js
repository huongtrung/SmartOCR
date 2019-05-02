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
        const { navigation } = this.props
        hasBack = navigation.getParam('hasBack', true)
        isCam = navigation.getParam('isCam', false)
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
            mHasBack: hasBack,
            mIsCam: isCam,
            isBackNotEmpty: false,
            isFrontNotEmpty: false,
            isSexEmpty: false,
            isCreateAtEmpty: false
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
                if (frontObj != null) {
                    console.log(frontObj.name);
                    if (frontObj.sex === 'N/A') {
                        console.log(frontObj.sex);
                        this.setState({
                            isSexEmpty: true
                        })
                        console.log('isSexEmpty', this.state.isSexEmpty)
                    } else {
                        this.setState({
                            mSex: frontObj.sex
                        })
                    }

                    this.setState({
                        mName: frontObj.name,
                        mID: frontObj.id,
                        mBirthday: frontObj.birthday,
                        mAddress: frontObj.address
                    })
                } else {
                    this.setState({
                        isFrontNotEmpty: true
                    })
                }
            } catch (ex) {
                console.error(ex);
            }
        });
        AsyncStorage.getItem(Constant.DATA_BACK, (err, result) => {
            try {
                let backObj = JSON.parse(result);
                if (backObj != null) {
                    if (backObj.issue_at === 'N/A') {
                        console.log(backObj.issue_at);
                        this.setState({
                            isCreateAtEmpty: true
                        })
                        console.log('isCreateAtEmpty', this.state.isCreateAtEmpty)
                    } else {
                        this.setState({
                            mCreateAt: backObj.issue_at
                        })
                    }
                    this.setState({
                        mCreateDate: backObj.issue_date
                    })
                } else {
                    this.setState({
                        isBackNotEmpty: true
                    })
                }
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
                        <Text style={this.state.isFrontNotEmpty ? styles.hidden : styles.titleText}>{I18n.t('title_image_front')}</Text>
                        <Image
                            source={{ uri: this.state.mFileFrontPath }}
                            style={this.state.isFrontNotEmpty ? styles.hidden : [styles.img, styles.marginBottom]}
                            resizeMode={this.state.mIsCam ? "contain" : "contain"} />
                        <View style={this.state.mHasBack ? {} : styles.hidden}>
                            <Text style={this.state.isBackNotEmpty ? styles.hidden : styles.titleText}>{I18n.t('title_image_back')}</Text>
                            <Image
                                source={{ uri: this.state.mFileBackPath }}
                                style={this.state.isBackNotEmpty ? styles.hidden : [styles.img, styles.marginBottom]}
                                resizeMode={this.state.mIsCam ? "contain" : "contain"} />
                        </View>
                        <TitleText title={I18n.t('title_name')} />
                        <ContentText text={this.state.mName} />

                        <TitleText title={I18n.t('title_id')} />
                        <ContentText text={this.state.mID} />

                        <TitleText title={I18n.t('title_create_date')} />
                        <ContentText text={this.state.mCreateDate} />

                        <TitleText title={I18n.t('title_create_at')} isHidden={this.state.isCreateAtEmpty} />
                        <ContentText text={this.state.mCreateAt} isHidden={this.state.isCreateAtEmpty} />

                        <TitleText title={I18n.t('title_birthday')} />
                        <ContentText text={this.state.mBirthday} />

                        <TitleText title={I18n.t('title_sex')} isHidden={this.state.isSexEmpty} />
                        <ContentText text={this.state.mSex} isHidden={this.state.isSexEmpty} />

                        <TitleText title={I18n.t('title_address')} />
                        <ContentText text={this.state.mAddress} />

                        <TouchableOpacity
                            style={{ marginBottom: 20 }}
                            underlayColor='#fff'
                            onPress={this.confirmAgain.bind(this)}>
                            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#f33f5e', '#ab6f84']} style={styles.button}>
                                <Text style={styles.buttonText}>{I18n.t('title_take_choose')}</Text>
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
        color: "#7e7e7e",
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 15
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
    }, hidden: {
        width: 0,
        height: 0,
    },
})

export default InfoDocumentScreen;