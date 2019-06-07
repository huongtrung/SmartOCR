import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, } from 'react-native';
import I18n, { getLanguages } from 'react-native-i18n';
import TitleText from './TitleText';
import ContentText from './ContentText';
I18n.fallbacks = true;

I18n.translations = {
    'en': require('../translation/en'),
    'ja': require('../translation/ja'),
}
export default class LicenceVNComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <Text style={this.props.isFrontNotEmpty ? styles.hidden : styles.titleText}>{I18n.t('title_image_front')}</Text>
                <Image
                    source={{ uri: this.props.mFileFrontPath }}
                    resizeMode='contain'
                    style={this.props.isFrontNotEmpty ? styles.hidden : [styles.img, styles.marginBottom]}
                />
                <TitleText title={I18n.t('title_name')} />
                <ContentText text={this.props.mName} />

                <TitleText title={I18n.t('title_id')} />
                <ContentText text={this.props.mID} />

                <TitleText title={I18n.t('title_class')} />
                <ContentText text={this.props.mClass} />

                <TitleText title={I18n.t('title_expiration')} />
                <ContentText text={this.props.mExpiry} />

                <TitleText title={I18n.t('title_create_date')} />
                <ContentText text={this.props.mCreateDate} />

                <TitleText title={I18n.t('title_create_at')}  />
                <ContentText text={this.props.mCreateAt} />

                <TitleText title={I18n.t('title_birthday')} />
                <ContentText text={this.props.mBirthday} />

                <TitleText title={I18n.t('title_nationality')}  />
                <ContentText text={this.props.mNational} />

                <TitleText title={I18n.t('title_address')} />
                <ContentText text={this.props.mAddress} />
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


