import React from "react";
import {useForm} from "react-hook-form";
import {getLoginHandleSubmit, LoginFormFieldType, loginUseFormProps} from "../../../../constants/formSchema/loginForm";
import {useDatabase} from "../../../../db/Database";
import {GLOBAL_STYLE, ICON_NAMES} from "../../../../constants/constants";
import {Text, View} from "react-native";
import InputText from "../../../../components/Input/InputText";
import Button from "../../../../components/Button/Button";
import TextDivider from "../../../../components/TextDivider/TextDivider";
import {theme} from "../../../../constants/theme";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";

const LoginForm: React.FC = () => {
    const { control, handleSubmit } =
        useForm<LoginFormFieldType>(loginUseFormProps)
    const { supabaseConnector } = useDatabase();
    const submitHandler = getLoginHandleSubmit({handleSubmit, supabaseConnector})

    return (
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
                <Button
                    onPress={ () => 1 }
                    title="Folytatás Google fiókkal"
                    icon={ require("../../../../assets/google_logo.png") }
                    inverse
                    backgroundColor={ theme.colors.white }
                    textColor={ theme.colors.googleRed }
                    textStyle={{ fontSize: hp(2) }}
                />
                <Button
                    onPress={ () => 1 }
                    title="Folytatás Facebook fiókkal"
                    icon={ require("../../../../assets/facebook_logo.png") }
                    backgroundColor={ theme.colors.facebookBlue }
                    textColor={ theme.colors.white }
                    textStyle={{ fontSize: hp(2) }}
                />
            </View>
        </KeyboardAwareScrollView>
    )
}

export default LoginForm;