import React from "react";
import { useForm } from "react-hook-form";
import { getLoginHandleSubmit, LoginFormFieldType, loginUseFormProps } from "./loginFormSchema";
import { useDatabase } from "../../../utils/database/Database";
import { GLOBAL_STYLE, ICON_NAMES } from "../../../constants/constants";
import { Text } from "react-native";
import Button, { FacebookButton, GoogleButton } from "../../../components/shared/Button";
import TextDivider from "../../../components/shared/TextDivider";
import { theme } from "../../../constants/theme";
import InputText from "../../../components/form/InputText/InputText";
import { Form } from "../../../components/form/Form";

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