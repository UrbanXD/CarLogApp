import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { DEFAULT_SEPARATOR, FONT_SIZES, GLOBAL_STYLE, ICON_NAMES, SEPARATOR_SIZES } from "../constants/constants.ts";
import Image from "../components/Image.tsx";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useSession } from "../features/Auth/context/SessionProvider.tsx";
import { theme } from "../constants/theme.ts";
import Divider from "../components/Divider.tsx";
import Button from "../components/Button/Button.ts";
import useAuth from "../hooks/useAuth.tsx";

const ProfileScreen: React.FC = () => {
    const { session } = useSession();
    const { signOut } = useAuth();

    return (
        <SafeAreaView style={ styles.pageContainer }>
            <View style={{ gap: SEPARATOR_SIZES.extraMedium }}>
                <View style={ styles.informationContainer }>
                    <Image
                        source={ require("../../src/assets/images/car1.jpg") }
                        imageStyle={ styles.profileImage }
                    />
                    <View style={ styles.textContainer }>
                        <Text style={ styles.nameText }>
                            { `${ session?.user.user_metadata.lastname } ${ session?.user.user_metadata.firstname }` }
                        </Text>
                        <Text style={ styles.emailText }>
                            { session?.user.email }
                        </Text>
                    </View>
                </View>
                <View>
                    <Button.Text
                        iconLeft={ ICON_NAMES.settings }
                        iconRight={ ICON_NAMES.rightArrowHead }
                        text="Beállítások"
                        textStyle={{ textAlign: "left" }}
                        onPress={ () => {} }
                        backgroundColor="transparent"
                        fontSize={ FONT_SIZES.intermediate }
                    />
                    <Divider />
                    <Button.Text
                        iconLeft={ ICON_NAMES.password }
                        iconRight={ ICON_NAMES.rightArrowHead }
                        text="Jelszó csere"
                        textStyle={{ textAlign: "left" }}
                        onPress={ () => resetPassword("") }
                        backgroundColor="transparent"
                        fontSize={ FONT_SIZES.intermediate }
                    />
                    <Divider />
                    <Button.Text
                        iconLeft={ ICON_NAMES.trashCan }
                        iconRight={ ICON_NAMES.rightArrowHead }
                        text="Fiók törlése"
                        onPress={ () => {} }
                        textStyle={{ textAlign: "left" }}
                        backgroundColor="transparent"
                        textColor={ theme.colors.redLight }
                        fontSize={ FONT_SIZES.intermediate }
                    />
                </View>
            </View>
            <Button.Text
                iconLeft={ ICON_NAMES.signOut }
                text="Kijelentkezés"
                onPress={ signOut }
                height={ hp(6) }
                backgroundColor={ theme.colors.googleRed }
                textColor={ theme.colors.black2 }
                fontSize={ FONT_SIZES.intermediate }
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        ...GLOBAL_STYLE.pageContainer,
        paddingHorizontal: DEFAULT_SEPARATOR,
        justifyContent: "space-between",
        paddingBottom: DEFAULT_SEPARATOR,
    },
    informationContainer: {
        flexDirection: "column",
        gap: SEPARATOR_SIZES.mediumSmall,
        justifyContent: "center",
        alignItems: "center"
    },
    profileImage: {
        position: "relative",
        width: hp(17),
        height: hp(17),
        borderRadius: 100,
        resizeMode: "stretch"
    },
    textContainer: {
        gap: SEPARATOR_SIZES.lightSmall / 2
    },
    nameText: {
        ...GLOBAL_STYLE.containerTitleText,
        lineHeight: GLOBAL_STYLE.containerTitleText.fontSize,
        textAlign: "center"
    },
    emailText: {
        ...GLOBAL_STYLE.containerText,
        lineHeight: GLOBAL_STYLE.containerText.fontSize,
        textAlign: "center"
    },
    actionContainer: {
        flex: 1,
        backgroundColor: theme.colors.black4,
        borderRadius: 25,
        gap: 10,
        paddingVertical: SEPARATOR_SIZES.mediumSmall,
        paddingHorizontal: SEPARATOR_SIZES.mediumSmall
    },
    container: {
        height: 50,
        width: "100%",
        backgroundColor: "red"
    }
});

export default ProfileScreen;