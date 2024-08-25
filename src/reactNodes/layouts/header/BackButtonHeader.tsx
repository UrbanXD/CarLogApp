import React from "react";
import {theme} from "../../../constants/theme";
import Header from "../../../components/Header/Header";
import HeaderBackButton from "../../../components/Header/HeaderBackButton";
import {FONT_SIZES, SIMPLE_HEADER_HEIGHT} from "../../../constants/constants";
import HeaderTitle from "../../../components/Header/HeaderTitle";
import {ColorValue, StyleSheet, Text, View} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import {Portal} from "react-native-paper";
import {NativeStackHeaderProps} from '@react-navigation/native-stack'
interface BackButtonHeaderProps {
    backButtonAction?: () => void
    title?: string
    backgroundColor?: ColorValue
}

const BackButtonHeader: React.FC<NativeStackHeaderProps & BackButtonHeaderProps> = ({ route, backButtonAction, title, backgroundColor = theme.colors.black }) => {
    return (
        <Header
            statusbarColor={ backgroundColor }
            statusBarIsTransculent={ false }
            backgroundColor={ backgroundColor }
            statusBarStyle="light-content"
        >
            <HeaderBackButton
                backAction={ backButtonAction }
            />
            {
                title &&
                    <HeaderTitle
                        title={ title }
                        titleStyle={ styles.headerTitle }
                    />
            }
        </Header>
    );
}

const styles = StyleSheet.create({
    headerTitle: {
        fontSize: FONT_SIZES.large,
        fontFamily: "Gilroy-Heavy",
        color: theme.colors.white,
    }
})

export default BackButtonHeader;