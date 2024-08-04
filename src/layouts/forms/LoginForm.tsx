import React, {useState} from "react";
import {z} from "zod";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import Animated, { SlideInDown } from "react-native-reanimated";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { StyleSheet, Text, View } from "react-native";
import { GLOBAL_STYLE, ICON_NAMES } from "../../constants/constants";
import InputText from "../../components/Form/InputText";
import Button from "../../components/Button/Button";
import TextDivider from "../../components/TextDivider/TextDivider";
import { theme } from "../../styles/theme";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useDatabase } from "../../db/Database";
import { getLoginHandleSubmit, LoginFormFieldType, loginUseFormProps } from "../../constants/formSchema/loginForm";

const LoginForm: React.FC = () => {
    const { control, handleSubmit } =
        useForm<LoginFormFieldType>(loginUseFormProps)
    const { supabaseConnector } = useDatabase();
    const submitHandler = getLoginHandleSubmit({handleSubmit, supabaseConnector})

    return (
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

                    <TextDivider title="vagy" color={ theme.colors.grayLight } lineHeight={ 1 } marginVertical={ GLOBAL_STYLE.formContainer.gap }/>
                    <Button onPress={ () => 1 } title="Folytatás Google fiókkal" icon={require("../../assets/google_logo.png")} inverse={true} backgroundColor={ theme.colors.white } textColor={ theme.colors.googleRed } textStyle={{ fontSize: hp(2) }} />
                    <Button onPress={ () => 1 } title="Folytatás Facebook fiókkal" icon={require("../../assets/facebook_logo.png")} backgroundColor={ theme.colors.facebookBlue } textColor={ theme.colors.white } textStyle={{ fontSize: hp(2) }} />
                </View>
            </KeyboardAwareScrollView>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderTopLeftRadius: 125,
        shadowColor: theme.colors.primaryBackground4,
        elevation: 10,
        backgroundColor: theme.colors.primaryBackground4,
        paddingVertical: hp(7.5),
        paddingHorizontal: wp(10)
    }
})

export default LoginForm;