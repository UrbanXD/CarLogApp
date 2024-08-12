import React, {useEffect, useState} from "react";
import {GLOBAL_STYLE, ICON_NAMES, SEPARATOR_SIZES} from "../constants/constants";
import {theme} from "../styles/theme";
import BackButtonHeader from "../layouts/header/BackButtonHeader";
import {router} from "expo-router";
import {StyleSheet, Text, View} from "react-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {KeyboardAwareScrollView, KeyboardProvider} from "react-native-keyboard-controller";
import Animated, {SlideInDown} from "react-native-reanimated";
import InputText from "../components/Form/InputText";
import Button from "../components/Button/Button";
import TextDivider from "../components/TextDivider/TextDivider";
import {useForm} from "react-hook-form";
import {getLoginHandleSubmit, LoginFormFieldType, loginUseFormProps} from "../constants/formSchema/loginForm";
import {useDatabase} from "../db/Database";

const LoginScreen: React.FC = () => {
    const { control, handleSubmit } =
        useForm<LoginFormFieldType>(loginUseFormProps)
    const { supabaseConnector } = useDatabase();
    const submitHandler = getLoginHandleSubmit({handleSubmit, supabaseConnector})

    return (
        <View style={ [GLOBAL_STYLE.pageContainer, { backgroundColor: theme.colors.black, gap: hp(6.5) }] }>
            <BackButtonHeader title={"Bejelentkezés"} backButtonAction={ () => router.replace({ pathname: "/" }) } />
            <Animated.View
                entering={ SlideInDown.duration(750) }
                style={ styles.container }
            >
                <KeyboardAwareScrollView
                    bounces={ false }
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={ false }
                    contentContainerStyle={ GLOBAL_STYLE.scrollViewContentContainer }
                >
                    <View style={ GLOBAL_STYLE.formContainer }>
                        <InputText
                            control={ control }
                            fieldName="email"
                            fieldNameText="Email cím"
                            icon={ ICON_NAMES.email }
                            placeholder="Email"
                        />
                        <InputText
                            control={ control }
                            fieldName="password"
                            fieldNameText="Jelszó"
                            icon={ ICON_NAMES.password }
                            placeholder="Jelszó"
                            isSecure={ true }
                        />
                        <Text style={ GLOBAL_STYLE.formLinkText }>Elfelejtette jelszavát?</Text>
                        <Button title="Bejelentkezés" onPress={ submitHandler } />
                        <TextDivider title="vagy" color={ theme.colors.gray1 } lineHeight={ 1 } marginVertical={ GLOBAL_STYLE.formContainer.gap }/>
                        <Button onPress={ () => 1 } title="Folytatás Google fiókkal" icon={require("../assets/google_logo.png")} inverse={true} backgroundColor={ theme.colors.white } textColor={ theme.colors.googleRed } textStyle={{ fontSize: hp(2) }} />
                        <Button onPress={ () => 1 } title="Folytatás Facebook fiókkal" icon={require("../assets/facebook_logo.png")} backgroundColor={ theme.colors.facebookBlue } textColor={ theme.colors.white } textStyle={{ fontSize: hp(2) }} />
                    </View>
                </KeyboardAwareScrollView>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderTopLeftRadius: 125,
        shadowColor: theme.colors.black2,
        elevation: 10,
        backgroundColor: theme.colors.black2,
        paddingVertical: SEPARATOR_SIZES.large,
        paddingHorizontal: SEPARATOR_SIZES.medium
    }
})

export default LoginScreen;