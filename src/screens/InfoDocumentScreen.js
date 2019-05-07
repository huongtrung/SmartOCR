import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Image, Text, TouchableOpacity } from 'react-native'
import I18n, { getLanguages } from 'react-native-i18n';
import Header from '../components/Header';
import CmtComponent from '../components/CmtComponent';
import LicenseComponent from '../components/LicenseComponent';
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
        typeDocument = navigation.getParam('typeDocument', 0)
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

            mNameLicense: '',
            mBirthGengoLicense: '',
            mBirthYyyyMmDdLicense: '',
            mAddressLicense: '',

            mHasBack: hasBack,
            mIsCam: isCam,
            isBackNotEmpty: false,
            isFrontNotEmpty: false,
            isSexEmpty: false,
            isCreateAtEmpty: false,
            mTypeDocument: typeDocument,
            mErrorMessage : ''
        }
        console.log('mTypeDocument', this.state.mTypeDocument)
    }

    confirmAgain = () => {
        this.props.navigation.navigate('ChooseMethod')
    }

    componentWillMount() {
        console.log('componentWillMount')
        getLanguages().then(languages => {
            this.setState({ languages });
        });
        switch (this.state.mTypeDocument) {
            case 5:
                AsyncStorage.getItem(Constant.DATA_FRONT, (err, result) => {
                    try {
                        let frontObj = JSON.parse(result);
                        if (frontObj != null) {
                            this.setState({
                                mNameLicense: frontObj.Kanji_Name,
                                mBirthGengoLicense: frontObj.BirthGengo + frontObj.BirthDd + "年" + frontObj.BirthMm + "月" + frontObj.BirthYy + "日",
                                mBirthYyyyMmDdLicense: frontObj.BirthYyyyMmDd,
                                mAddressLicense: frontObj.Address,
                                mErrorMessage : frontObj.ErrorMessageId
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
                break;
            case 1:
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
                break;
        }
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

        let checkDocument = this.state.mTypeDocument === 1 ?
            <CmtComponent
                mFileFrontPath={this.state.mFileFrontPath}
                isFrontNotEmpty={this.state.isFrontNotEmpty}
                mHasBack={this.state.mHasBack}
                isBackNotEmpty={this.state.isBackNotEmpty}
                mFileBackPath={this.state.mFileBackPath}
                mName={this.state.mName}
                mID={this.state.mID}
                mCreateDate={this.state.mCreateDate}
                isCreateAtEmpty={this.state.isCreateAtEmpty}
                mBirthday={this.state.mBirthday}
                mSex={this.state.mSex}
                isSexEmpty={this.state.isSexEmpty}
                mAddress={this.state.mAddress}
            /> : this.state.mTypeDocument === 5 ?
                <LicenseComponent
                    mErrorMessage={this.state.mErrorMessage}
                    mFileFrontPath={this.state.mFileFrontPath}
                    isFrontNotEmpty={this.state.isFrontNotEmpty}
                    mNameLicense={this.state.mNameLicense}
                    mBirthdayLicense={this.state.mBirthGengoLicense}
                    mBirthdayNumberLicense={this.state.mBirthYyyyMmDdLicense}
                    mAddressLicense={this.state.mAddressLicense}

                /> : null
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Header title={I18n.t('title_info_header')} />
                    <View style={styles.containerDoc}>
                        {checkDocument}
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