import React from "react";
import { useForm } from "react-hook-form";
import { getLoginHandleSubmit, LoginFormFieldType, loginUseFormProps } from "../constants/loginFormSchema";
import { useDatabase } from "../../core/utils/database/Database";
import { GLOBAL_STYLE, ICON_NAMES } from "../../core/constants/constants";
import { Text } from "react-native";
import InputText from "../../core/components/input/InputText/InputText";
import Button, { FacebookButton, GoogleButton } from "../../core/components/shared/Button";
import TextDivider from "../../core/components/shared/TextDivider";
import { theme } from "../../core/constants/theme";
import { Form } from "../../core/components/form/Form";

const LoginForm: React.FC = () => {
    const { control, handleSubmit } =
        useForm<LoginFormFieldType>(loginUseFormProps)
    const { supabaseConnector } = useDatabase();
    const submitHandler = getLoginHandleSubmit({handleSubmit, supabaseConnector})

    return (
        <Form>
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
            <Text style={ GLOBAL_STYLE.formLinkText }>
                Elfelejtette jelszavát?
            </Text>
            <Button title="Bejelentkezés" onPress={ submitHandler } />
            <TextDivider
                title="vagy"
                color={ theme.colors.gray1 }
                lineHeight={ 1 }
                marginVertical={ GLOBAL_STYLE.formContainer.gap }

            />
            <GoogleButton onPress={ () => 1 } />
            <FacebookButton onPress={ () => 1 } />
        </Form>
    )
}

export default LoginForm;