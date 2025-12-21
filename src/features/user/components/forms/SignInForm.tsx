import React from "react";
import Input from "../../../../components/Input/Input.ts";
import { COLORS, FONT_SIZES, GLOBAL_STYLE, ICON_NAMES } from "../../../../constants/index.ts";
import { View } from "react-native";
import Button from "../../../../components/Button/Button.ts";
import TextDivider from "../../../../components/TextDivider.tsx";
import Form from "../../../../components/Form/Form.tsx";
import { FormState, useForm } from "react-hook-form";
import { useAuth } from "../../../../contexts/auth/AuthContext.ts";
import { SignInRequest, useSignInFormProps } from "../../schemas/form/signInRequest.ts";
import { useTranslation } from "react-i18next";
import { formTheme } from "../../../../ui/form/constants/theme.ts";
import Link from "../../../../components/Link.tsx";
import { router } from "expo-router";

type SignInFormProps = {
    onFormStateChange?: (formState: FormState<SignInRequest>) => void
}

function SignInForm({ onFormStateChange }: SignInFormProps) {
    const form = useForm<SignInRequest>(useSignInFormProps);
    const { control, handleSubmit } = form;

    const { t } = useTranslation();
    const { signIn } = useAuth();
    const submitHandler = handleSubmit(signIn);

    const openResetPassword = () => {
        router.push({ pathname: "user/resetPassword", params: { email: form.getValues("email") } });
    };

    return (
        <Form
            form={ form }
            onFormStateChange={ onFormStateChange }
            formFields={
                <View style={ { gap: formTheme.gap } }>
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
                    <Link
                        onPress={ openResetPassword }
                        text={ t("auth.forgot_your_password") }
                        textStyle={ { textAlign: "left", fontSize: FONT_SIZES.p3 } }
                        style={ { alignSelf: "flex-start", alignItems: "flex-start" } }
                    />
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
                </View>
            }
        />
    );
}

export default SignInForm;