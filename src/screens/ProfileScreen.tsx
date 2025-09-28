import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
import Avatar from "../components/Avatar/Avatar.ts";
import { getLabelByName } from "../utils/getLabelByName.ts";
import { useAuth } from "../contexts/auth/AuthContext.ts";
import { Redirect, router } from "expo-router";
import { useAppSelector } from "../hooks/index.ts";
import { getUser } from "../features/user/model/selectors/index.ts";
import { EDIT_USER_FORM_TYPE } from "../features/user/presets/bottomSheet/index.ts";
import { ScreenScrollView } from "../components/screenView/ScreenScrollView.tsx";

const ProfileScreen: React.FC = () => {
    const user = useAppSelector(getUser);
    const { hasPassword, signOut, deleteAccount } = useAuth();
    const { bottom } = useSafeAreaInsets();

    if(!user) return Redirect({ href: "backToRootIndex" });
    const name = `${ user.lastname } ${ user.firstname }`;
    const avatarColor = user.avatarColor;

    const openEditUser = (type: EDIT_USER_FORM_TYPE) => router.push({
        pathname: "bottomSheet/editUser",
        params: { type }
    });

    const openEditName = () => openEditUser(EDIT_USER_FORM_TYPE.EditName);
    const openLinkPasswordToOAuth = () => openEditUser(EDIT_USER_FORM_TYPE.LinkPasswordToOAuth);
    const openResetPassword = () => openEditUser(EDIT_USER_FORM_TYPE.ResetPassword);
    const openChangeEmail = () => openEditUser(EDIT_USER_FORM_TYPE.ChangeEmail);
    const openEditAvatar = () => openEditUser(EDIT_USER_FORM_TYPE.EditAvatar);

    const styles = useStyles(bottom);

    return (
        <ScreenScrollView
            screenHasTabBar={ false }
            safeAreaEdges={ ["top", "left", "right"] }
            style={ { paddingBottom: 0, paddingHorizontal: 0 } }
        >
            <View style={ styles.container }>
                <View style={ styles.informationContainer }>
                    {
                        user?.userAvatar
                        ? <Avatar.Image
                            source={ user.userAvatar.image }
                            avatarSize={ hp(20) }
                            borderColor={ COLORS.black5 }
                            style={ styles.profileImage }
                            onPressBadge={ openEditAvatar }
                        />
                        : <Avatar.Text
                            label={ getLabelByName(name) }
                            avatarSize={ hp(20) }
                            backgroundColor={ avatarColor ?? undefined }
                            borderColor={ COLORS.black5 }
                            style={ styles.profileImage }
                            onPressBadge={ openEditAvatar }
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
                        text="Személyes adatok"
                        textStyle={ { textAlign: "left" } }
                        onPress={ openEditName }
                        backgroundColor="transparent"
                        fontSize={ FONT_SIZES.p1 }
                        loadingIndicator
                    />
                    {/*<Divider/>*/ }
                    {/*<Button.Text*/ }
                    {/*    iconLeft={ ICON_NAMES.user }*/ }
                    {/*    iconRight={ ICON_NAMES.rightArrowHead }*/ }
                    {/*    text="Identity link"*/ }
                    {/*    textStyle={ { textAlign: "left" } }*/ }
                    {/*    onPress={ () => {*/ }
                    {/*    } }*/ }
                    {/*    backgroundColor="transparent"*/ }
                    {/*    fontSize={ FONT_SIZES.p1 }*/ }
                    {/*    loadingIndicator*/ }
                    {/*/>*/ }
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
                        text={ hasPassword ? "Jelszó csere" : "Jelszó hozzáadás" }
                        textStyle={ { textAlign: "left" } }
                        onPress={ hasPassword ? openResetPassword : openLinkPasswordToOAuth }
                        backgroundColor="transparent"
                        fontSize={ FONT_SIZES.p1 }
                        loadingIndicator
                    />
                    <Divider/>
                    <Button.Text
                        iconLeft={ ICON_NAMES.trashCan }
                        iconRight={ ICON_NAMES.rightArrowHead }
                        text="Fiók törlése"
                        onPress={ deleteAccount }
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
        </ScreenScrollView>
    );
};

const useStyles = (bottom: number) => StyleSheet.create({
    pageContainer: {
        flex: 1
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
        paddingBottom: DEFAULT_SEPARATOR + bottom,
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
        top: -hp(10) //4.5
    }
});

export default ProfileScreen;