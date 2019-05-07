import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, } from 'react-native';
import I18n, { getLanguages } from 'react-native-i18n';
import TitleText from '../components/TitleText';
import ContentText from '../components/ContentText';
I18n.fallbacks = true;

I18n.translations = {
    'en': require('../translation/en'),
    'ja': require('../translation/ja'),
}
const ErrorView = () => (
    <View
        style={{
            width: '100%',
            flex: 1,
            backgroundColor: '#313538',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
        <Text style={styles.buttonText}>{I18n.t('title_not_auth')}</Text>
    </View>
);
export default class CmtComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <Text style={styles.titleText}>{I18n.t('title_image_front')}</Text>
                <Image
                    source={{ uri: this.props.mFileFrontPath }}
                    resizeMode='contain'
                    style={this.props.isFrontNotEmpty ? styles.hidden : [styles.img, styles.marginBottom]}
                />
                <TitleText title={I18n.t('title_name_license')} />
                <ContentText text={this.props.mNameLicense} />

                <TitleText title={I18n.t('title_birthday_license')} />
                <ContentText text={this.props.mBirthdayLicense} />

                <TitleText title={I18n.t('title_birth_yyyyMmDd_license')} />
                <ContentText text={this.props.mBirthdayNumberLicense} />

                <TitleText title={I18n.t('title_address_license')} />
                <ContentText text={this.props.mAddressLicense} />
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
});


