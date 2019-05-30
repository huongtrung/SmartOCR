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

export default class PassportComponent extends Component {
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
                <TitleText title={I18n.t('title_name')}  />
                <ContentText text={this.props.mPassportName} />
                
                <TitleText title={I18n.t('title_passport_number')} />
                <ContentText text={this.props.mPassportNumber} />

                <TitleText title={I18n.t('title_expiration')} />
                <ContentText text={this.props.mPassportExpireDate} />

                <TitleText title={I18n.t('title_country_code')} />
                <ContentText text={this.props.mPassportNationCode} />

                <TitleText title={I18n.t('title_nationality')} />
                <ContentText text={this.props.mPassportNation} />

                <TitleText title={I18n.t('title_sex')} />
                <ContentText text={this.props.mPassportSex} />

                <TitleText title={I18n.t('title_birthday')} />
                <ContentText text={this.props.mPassportBirthday} />
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


