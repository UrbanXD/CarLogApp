import React from "react";
import Input from "../../../../components/Input/Input.ts";
import { COLORS, GLOBAL_STYLE, ICON_NAMES } from "../../../../constants/index.ts";
import { Text } from "react-native";
import Button from "../../../../components/Button/Button.ts";
import TextDivider from "../../../../components/TextDivider.tsx";
import Form from "../../../../components/Form/Form.tsx";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../../contexts/auth/AuthContext.ts";
import { SignInRequest, useSignInFormProps } from "../../schemas/form/signInRequest.ts";
import { useTranslation } from "react-i18next";

const SignInForm: React.FC = () => {
    const {
        control,
        handleSubmit
    } = useForm<SignInRequest>(useSignInFormProps);

    const { t } = useTranslation();
    const { signIn } = useAuth();
    const submitHandler = handleSubmit(signIn);

    return (
        <Form>
            <Input.Field
                control={ control }
                fieldName="email"
                fieldNameText={ t("auth.user.email") }
            >
                <Input.Text
                    icon={ ICON_NAMES.email }
                    placeholder={ t("auth.user.email_placeholder") }
                    keyboardType="email-address"
                />
            </Input.Field>
            <Input.Field
                control={ control }
                fieldName="password"
                fieldNameText={ t("auth.user.password") }
            >
                <Input.Text
                    icon={ ICON_NAMES.password }
                    placeholder={ t("auth.user.password_placeholder") }
                    secure
                />
            </Input.Field>
            <Text style={ GLOBAL_STYLE.formLinkText }>
                { t("auth.forgot_your_password") }
            </Text>
            <Button.Text
                text={ t("auth.sign_in") }
                loadingIndicator
                onPress={ submitHandler }
            />
            <TextDivider
                title={ t("common.or") }
                color={ COLORS.gray1 }
                lineHeight={ 1 }
                marginVertical={ GLOBAL_STYLE.formContainer.gap }
            />
            <Button.Google/>
        </Form>
    );
};

export default SignInForm;