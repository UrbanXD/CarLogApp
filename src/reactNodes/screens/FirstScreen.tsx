import React, { ReactElement, useRef, useState } from "react";
import {
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from "react-native";
import {
    DEFAULT_SEPARATOR,
    FONT_SIZES,
    GET_ICON_BUTTON_RESET_STYLE,
    GLOBAL_STYLE,
    ICON_NAMES,
    SEPARATOR_SIZES
} from "../../constants/constants";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { theme } from "../../constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Divider, IconButton } from "react-native-paper";
import Button from "../../components/Button/Button";
import CustomBottomSheet from "../../components/BottomSheet/BottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import RegisterForm from "../layouts/forms/RegisterForm/RegisterForm";
import LoginForm from "../layouts/forms/LoginForm/LoginForm";

const FirstScreen: React.FC = () => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [bottomSheetTitle, setBottomSheetTitle] = useState("");
    const [bottomSheetContent, setBottomSheetContent] = useState<ReactElement | null>(null);

    const openRegister = () => {
        setBottomSheetTitle("Felhasználó létrehozás");
        setBottomSheetContent(<RegisterForm />);
        bottomSheetModalRef.current?.present();
    }
    const openLogin = () => {
        setBottomSheetTitle("Bejelentkezés")
        setBottomSheetContent(<LoginForm />);
        bottomSheetModalRef.current?.present();
    };

    return (
        <SafeAreaView style={ [GLOBAL_STYLE.pageContainer, { paddingHorizontal: 0, paddingVertical: 0 }]}>
            <CustomBottomSheet
                ref={ bottomSheetModalRef }
                title={ bottomSheetTitle }
                snapPoints={ ["100%"] }
                isHandlePanningGesture={ false }
                renderCloseButton={ () =>
                    <IconButton
                        icon={ ICON_NAMES.close }
                        size={ FONT_SIZES.medium }
                        iconColor={"whitesmoke"}
                        onPress={ () => bottomSheetModalRef.current?.close() }
                        style={ [GET_ICON_BUTTON_RESET_STYLE(FONT_SIZES.medium), { alignSelf: "center" }] }
                    /> }
            >
                { bottomSheetContent }
            </CustomBottomSheet>
            <ImageBackground
                source={ require("../../assets/images/home2.jpg") }
                style={ styles.imageContainer }
                imageStyle={ styles.imageContainer }
            >
                <LinearGradient
                    locations={[ 0, 0.35, 0.85 ]}
                    colors={ ["transparent", "rgba(0,0,0,0.25)", theme.colors.black] }
                    style={{ ...StyleSheet.absoluteFillObject, top: 20 }}
                />
            </ImageBackground>
            <View style={ styles.contentContainer }>
                <View style={{ top: -SEPARATOR_SIZES.lightLarge, gap: SEPARATOR_SIZES.mediumSmall }}>
                    <Text style={ styles.title }>Carlog</Text>
                    <Text style={ [styles.title, styles.titleEffect] }>Carlog</Text>
                    <Text style={ [styles.title, styles.titleEffect, { top: hp(2.5), zIndex: -1 }] }>Carlog</Text>
                    <Divider style={ styles.divider } />
                    <Text style={ styles.subtitle }>Kezelje nálunk autóit</Text>
                </View>
                <View style={ styles.actionContainer }>
                    <Button title="Regisztráció" onPress={ openRegister }/>
                    <Text style={ styles.underButtonText }>
                        Már rendelkezel felhasználóval ?
                        <Text style={ styles.linkText } onPress={ openLogin } >Jelentkezz be</Text>
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        flex: 0.85
    },
    image: {
        resizeMode: "cover",
    },
    contentContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: theme.colors.black,
        paddingHorizontal: DEFAULT_SEPARATOR,
        paddingBottom: GLOBAL_STYLE.pageContainer.paddingVertical,
    },
    title: {
        zIndex: 1,
        top: hp(FONT_SIZES.extraLarge / -12),
        alignSelf: "center",
        color: theme.colors.white,
        fontSize: FONT_SIZES.extraLarge,
        letterSpacing: FONT_SIZES.extraLarge * 0.01,
        fontFamily: "Gilroy-Heavy",
        textTransform: "uppercase",
    },
    titleEffect: {
        zIndex: 0,
        position: "absolute", top: -hp(2.5),
        color: theme.colors.black,
        textShadowOffset: { height: 0, width: 0 },
        textShadowColor: theme.colors.white,
        textShadowRadius: 1,
        textAlign: "center",
    },
    divider: {
        alignSelf: "center",
        backgroundColor: theme.colors.fuelYellow,
        height: 2,
        width: wp(70)
    },
    subtitle: {
        alignSelf: "center",
        color: theme.colors.gray2,
        fontSize: FONT_SIZES.normal,
        fontFamily: "Gilroy-Medium",
        textTransform: "uppercase",
        letterSpacing: FONT_SIZES.normal * 0.075
    },
    actionContainer: {
        flexDirection: "column",
        gap: SEPARATOR_SIZES.normal
    },
    underButtonText:{
        color: theme.colors.white,
        alignSelf: "center",
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.small,
        letterSpacing: FONT_SIZES.small * 0.1,
        lineHeight: FONT_SIZES.small * 1.5,
        textAlign: "center",
    },
    linkText: {
        color: theme.colors.fuelYellow,
        textDecorationLine: "underline",
        fontSize: FONT_SIZES.small * 1.05,
        letterSpacing: FONT_SIZES.small * 1.05 * 0.05,
    }
})

export default FirstScreen;
