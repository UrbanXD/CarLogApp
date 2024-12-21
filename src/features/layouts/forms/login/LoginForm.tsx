import React from "react";
import { useForm } from "react-hook-form";
import { getLoginHandleSubmit, LoginFormFieldType, loginUseFormProps } from "./loginFormSchema";
import { useDatabase } from "../../../core/utils/database/Database";
import { GLOBAL_STYLE, ICON_NAMES } from "../../../core/constants/constants";
import { Text } from "react-native";
import Button from "../../../core/components/shared/button/Button";
import TextDivider from "../../../core/components/shared/TextDivider";
import { theme } from "../../../core/constants/theme";
import Form from "../../../core/components/form/Form";
import Input from "../../../core/components/input/Input";

const LoginForm: React.FC = () => {
    const { control, handleSubmit } =
        useForm<LoginFormFieldType>(loginUseFormProps)
    const database = useDatabase();
    const submitHandler = getLoginHandleSubmit({handleSubmit, database})

    return (
        <Form>
            <Input.Text
                control={ control }
                fieldName="email"
                fieldNameText="Email cím"
                icon={ ICON_NAMES.email }
                placeholder="Email"
            />
            <Input.Text
                control={ control }
                fieldName="password"
                fieldNameText="Jelszó"
                icon={ ICON_NAMES.password }
                placeholder="Jelszó"
                isSecure
            />
            <Text style={ GLOBAL_STYLE.formLinkText }>
                Elfelejtette jelszavát?
            </Text>
            <Button.Text
                text="Bejelentkezés"
                onPress={ submitHandler }
            />
            <TextDivider
                title="vagy"
                color={ theme.colors.gray1 }
                lineHeight={ 1 }
                marginVertical={ GLOBAL_STYLE.formContainer.gap }

            />
            <Button.Google onPress={ () => 1 } />
        </Form>
    )
}

export default LoginForm;