import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import {
    COLORS,
    DEFAULT_SEPARATOR,
    FONT_SIZES,
    GLOBAL_STYLE,
    ICON_NAMES,
    SEPARATOR_SIZES
} from "../constants/index.ts";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Divider from "../components/Divider.tsx";
import Button from "../components/Button/Button.ts";
import { useBottomSheet } from "../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { EditUserBottomSheet } from "../features/user/presets/bottomSheet/index.ts";
import { EDIT_USER_FORM_STEPS } from "../features/user/hooks/useEditUserSteps.tsx";
import Avatar from "../components/Avatar/Avatar.ts";
import { getLabelByName } from "../utils/getLabelByName.ts";
import { useAuth } from "../contexts/auth/AuthContext.ts";
import { useUserManagement } from "../features/user/hooks/useUserManagement.ts";
import { Redirect } from "expo-router";

const ProfileScreen: React.FC = () => {
    const { session, user, signOut } = useAuth();
    const { deleteUserProfile } = useUserManagement();
    const { openBottomSheet } = useBottomSheet();

    if(!user) return Redirect({ href: "backToRootIndex" });
    const name = `${ user.lastname } ${ user.firstname }`;
    const avatarColor = user.avatarColor;

    const openEditUser =
        (stepIndex: number, passwordReset: boolean = true) =>
            openBottomSheet(
                EditUserBottomSheet({
                    user: {
                        email: user.email ?? undefined,
                        firstname: user.firstname ?? undefined,
                        lastname: user.lastname ?? undefined
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
    const openChangeAvatar =
        () => openEditUser(EDIT_USER_FORM_STEPS.AvatarStep);

    return (
        <SafeAreaView style={ styles.pageContainer }>
            <View style={ styles.container }>
                <View style={ styles.informationContainer }>
                    {
                        user?.userAvatar
                        ? <Avatar.Image
                            source={ user.userAvatar.image }
                            avatarSize={ hp(20) }
                            borderColor={ COLORS.black5 }
                            style={ styles.profileImage }
                            onPressBadge={ () => "" }
                        />
                        : <Avatar.Text
                            label={ getLabelByName(name) }
                            avatarSize={ hp(20) }
                            backgroundColor={ avatarColor ?? undefined }
                            borderColor={ COLORS.black5 }
                            style={ styles.profileImage }
                            onPressBadge={ () => "" }
                        />
                    }
                    <View style={ styles.textContainer }>
                        <Text style={ styles.nameText }>
                            { name }
                        </Text>
                        <Text style={ styles.emailText }>
                            { user?.email }
                        </Text>
                    </View>
                </View>
                <View style={ styles.actionButtonsContainer }>
                    <Button.Text
                        iconLeft={ ICON_NAMES.settings }
                        iconRight={ ICON_NAMES.rightArrowHead }
                        text="Beállítások"
                        textStyle={ { textAlign: "left" } }
                        onPress={ openChangeName }
                        backgroundColor="transparent"
                        fontSize={ FONT_SIZES.p1 }
                        loadingIndicator
                    />
                    <Divider/>
                    <Button.Text
                        iconLeft={ ICON_NAMES.settings }
                        iconRight={ ICON_NAMES.rightArrowHead }
                        text="Avatar"
                        textStyle={ { textAlign: "left" } }
                        onPress={ openChangeAvatar }
                        backgroundColor="transparent"
                        fontSize={ FONT_SIZES.p1 }
                        loadingIndicator
                    />
                    <Divider/>
                    <Button.Text
                        iconLeft={ ICON_NAMES.user }
                        iconRight={ ICON_NAMES.rightArrowHead }
                        text="Identity link"
                        textStyle={ { textAlign: "left" } }
                        onPress={ () => {
                        } }
                        backgroundColor="transparent"
                        fontSize={ FONT_SIZES.p1 }
                        loadingIndicator
                    />
                    <Divider/>
                    <Button.Text
                        iconLeft={ ICON_NAMES.email }
                        iconRight={ ICON_NAMES.rightArrowHead }
                        text="Email csere"
                        textStyle={ { textAlign: "left" } }
                        onPress={ openChangeEmail }
                        backgroundColor="transparent"
                        fontSize={ FONT_SIZES.p1 }
                        loadingIndicator
                    />
                    <Divider/>
                    <Button.Text
                        iconLeft={ ICON_NAMES.password }
                        iconRight={ ICON_NAMES.rightArrowHead }
                        text={ session?.user.user_metadata.has_password ? "Jelszó csere" : "Jelszó hozzáadás" }
                        textStyle={ { textAlign: "left" } }
                        onPress={ session?.user.user_metadata.has_password
                                  ? openResetPassword
                                  : openAddPasswordToOAuthUser }
                        backgroundColor="transparent"
                        fontSize={ FONT_SIZES.p1 }
                        loadingIndicator
                    />
                    <Divider/>
                    <Button.Text
                        iconLeft={ ICON_NAMES.trashCan }
                        iconRight={ ICON_NAMES.rightArrowHead }
                        text="Fiók törlése"
                        onPress={ deleteUserProfile }
                        textStyle={ { textAlign: "left" } }
                        backgroundColor="transparent"
                        textColor={ COLORS.redLight }
                        fontSize={ FONT_SIZES.p1 }
                        loadingIndicator
                    />
                </View>
                <Button.Text
                    iconLeft={ ICON_NAMES.signOut }
                    text="Kijelentkezés"
                    onPress={ signOut }
                    backgroundColor={ COLORS.googleRed }
                    textColor={ COLORS.black2 }
                    fontSize={ FONT_SIZES.p1 }
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    pageContainer: {
        ...GLOBAL_STYLE.pageContainer
    },
    container: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "90%",
        justifyContent: "space-between",
        gap: DEFAULT_SEPARATOR,
        backgroundColor: COLORS.black5,
        paddingHorizontal: DEFAULT_SEPARATOR,
        paddingBottom: DEFAULT_SEPARATOR,
        borderTopStartRadius: 40,
        borderTopEndRadius: 40,
        shadowColor: COLORS.black5,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.60,
        shadowRadius: 24,
        elevation: 12
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
        alignSelf: "center"
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