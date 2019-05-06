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
export default class CmtComponent extends Component {
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
                <View style={this.props.mHasBack ? {} : styles.hidden}>
                    <Text style={this.props.isBackNotEmpty ? styles.hidden : styles.titleText}>{I18n.t('title_image_back')}</Text>
                    <Image
                        resizeMode='contain'
                        source={{ uri: this.props.mFileBackPath }}
                        style={this.props.isBackNotEmpty ? styles.hidden : [styles.img, styles.marginBottom]}
                    />
                </View>
                <TitleText title={I18n.t('title_name')} />
                <ContentText text={this.props.mName} />

                <TitleText title={I18n.t('title_id')} />
                <ContentText text={this.props.mID} />

                <TitleText title={I18n.t('title_create_date')} />
                <ContentText text={this.props.mCreateDate} />

                <TitleText title={I18n.t('title_create_at')} isHidden={this.props.isCreateAtEmpty} />
                <ContentText text={this.props.mCreateAt} isHidden={this.props.isCreateAtEmpty} />

                <TitleText title={I18n.t('title_birthday')} />
                <ContentText text={this.props.mBirthday} />

                <TitleText title={I18n.t('title_sex')} isHidden={this.props.isSexEmpty} />
                <ContentText text={this.props.mSex} isHidden={this.props.isSexEmpty} />

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


