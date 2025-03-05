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
import { useBottomSheet } from "../features/BottomSheet/context/BottomSheetContext.ts";
import { EditUserBottomSheet } from "../features/BottomSheet/presets";
import { EDIT_USER_FORM_STEPS } from "../features/Form/layouts/auth/user/editUser/useEditUserSteps.tsx";
import Avatar from "../components/Avatar/Avatar.ts";
import { getLabelByName } from "../utils/getLabelByName.ts";

const ProfileScreen: React.FC = () => {
    const { session } = useSession();
    const { signOut, deleteUserProfile, linkIdentity } = useAuth();
    const { openBottomSheet } = useBottomSheet();

    const name = `${ session?.user.user_metadata.lastname } ${ session?.user.user_metadata.firstname }`;
    const nameLabel = getLabelByName(name);

    const openEditUser =
        (stepIndex: number, passwordReset: boolean = true) =>
            openBottomSheet(
                EditUserBottomSheet({
                    user: {
                        email: session?.user.email,
                        firstname: session?.user.user_metadata?.firstname,
                        lastname: session?.user.user_metadata?.lastname,
                    },
                    passwordReset,
                    stepIndex
                })
            );

    const openChangeName =
        () => openEditUser(EDIT_USER_FORM_STEPS.NameStep);
    const openAddPasswordToOAuthUser =
        () => openEditUser(EDIT_USER_FORM_STEPS.PasswordStep, false);
    const openResetPassword =
        () => openEditUser(EDIT_USER_FORM_STEPS.PasswordStep);
    const openChangeEmail =
        () => openEditUser(EDIT_USER_FORM_STEPS.EmailStep);

    return (
        <SafeAreaView style={ styles.pageContainer }>
            <View style={ styles.container }>
                <View style={ styles.informationContainer }>
                    <Avatar.Image
                        source={ require("../assets/images/home.jpg") }
                        avatarSize={ hp(21) }
                        borderColor={ theme.colors.black5 }
                        style={ styles.profileImage }
                    />
                    {/*<Avatar.Text*/}
                    {/*    label={ `${ nameLabel }` }*/}
                    {/*    avatarSize={ hp(21) }*/}
                    {/*    style={ styles.profileImage }*/}
                    {/*/>*/}
                    <View style={ styles.textContainer }>
                        <Text style={ styles.nameText }>
                            { name }
                        </Text>
                        <Text style={ styles.emailText }>
                            { session?.user.email }
                        </Text>
                    </View>
                </View>
                <View style={ styles.actionButtonsContainer }>
                    <Button.Text
                        iconLeft={ ICON_NAMES.settings }
                        iconRight={ ICON_NAMES.rightArrowHead }
                        text="Beállítások"
                        textStyle={{ textAlign: "left" }}
                        onPress={ openChangeName }
                        backgroundColor="transparent"
                        fontSize={ FONT_SIZES.p1 }
                        loadingIndicator
                    />
                    <Divider />
                    <Button.Text
                        iconLeft={ ICON_NAMES.user }
                        iconRight={ ICON_NAMES.rightArrowHead }
                        text="Identity link"
                        textStyle={{ textAlign: "left" }}
                        onPress={ () => {} }
                        backgroundColor="transparent"
                        fontSize={ FONT_SIZES.p1 }
                        loadingIndicator
                    />
                    <Divider />
                    <Button.Text
                        iconLeft={ ICON_NAMES.email }
                        iconRight={ ICON_NAMES.rightArrowHead }
                        text="Email csere"
                        textStyle={{ textAlign: "left" }}
                        onPress={ openChangeEmail }
                        backgroundColor="transparent"
                        fontSize={ FONT_SIZES.p1 }
                        loadingIndicator
                    />
                    <Divider />
                    <Button.Text
                        iconLeft={ ICON_NAMES.password }
                        iconRight={ ICON_NAMES.rightArrowHead }
                        text={ session?.user.user_metadata.has_password ? "Jelszó csere" : "Jelszó hozzáadás"}
                        textStyle={{ textAlign: "left" }}
                        onPress={ session?.user.user_metadata.has_password ? openResetPassword : openAddPasswordToOAuthUser }
                        backgroundColor="transparent"
                        fontSize={ FONT_SIZES.p1 }
                        loadingIndicator
                    />
                    <Divider />
                    <Button.Text
                        iconLeft={ ICON_NAMES.trashCan }
                        iconRight={ ICON_NAMES.rightArrowHead }
                        text="Fiók törlése"
                        onPress={ deleteUserProfile }
                        textStyle={{ textAlign: "left" }}
                        backgroundColor="transparent"
                        textColor={ theme.colors.redLight }
                        fontSize={ FONT_SIZES.p1 }
                        loadingIndicator
                    />
                </View>
                <Button.Text
                    iconLeft={ ICON_NAMES.signOut }
                    text="Kijelentkezés"
                    onPress={ signOut }
                    backgroundColor={ theme.colors.googleRed }
                    textColor={ theme.colors.black2 }
                    fontSize={ FONT_SIZES.p1 }
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        ...GLOBAL_STYLE.pageContainer,
    },
    container: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "90%",
        justifyContent: "space-between",
        gap: DEFAULT_SEPARATOR,
        backgroundColor: theme.colors.black5,
        paddingHorizontal: DEFAULT_SEPARATOR,
        paddingBottom: DEFAULT_SEPARATOR,
        borderTopStartRadius: 40,
        borderTopEndRadius: 40,
        shadowColor: theme.colors.black5,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.60,
        shadowRadius: 24,
        elevation: 12,
    },
    informationContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall
    },
    profileImage: {
        position: "relative",
        top: -hp(9),
        alignSelf: "center",
    },
    textContainer: {
        top: -hp(9),
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
    actionButtonsContainer: {
        top: -hp(4.5)
    }
});

export default ProfileScreen;