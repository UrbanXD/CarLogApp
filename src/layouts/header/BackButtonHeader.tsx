import React from "react";
import {theme} from "../../styles/theme";
import Header from "../../components/Header/Header";
import HeaderBackButton from "../../components/Header/HeaderBackButton";
import {FONT_SIZES, SIMPLE_HEADER_HEIGHT} from "../../constants/constants";
import HeaderTitle from "../../components/Header/HeaderTitle";
import {StyleSheet, Text, View} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

interface BackButtonHeaderProps {
    backButtonAction?: () => void
    title?: string
}

const BackButtonHeader: React.FC<BackButtonHeaderProps> = ({ backButtonAction, title }) => {
    return (
        <Header statusbarColor={ theme.colors.primaryBackground3 } statusBarIsTransculent={ false } backgroundColor="transparent" statusBarStyle={"dark-content"}>
            <HeaderBackButton backAction={ backButtonAction } />
            { title && <HeaderTitle title={ title } titleStyle={ styles.headerTitle } /> }
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