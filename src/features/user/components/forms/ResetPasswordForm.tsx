import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { FormState, useForm } from "react-hook-form";
import { EmailStep, PasswordStep } from "./steps/index.ts";
import { router } from "expo-router";
import { getToastMessage } from "../../../../ui/alert/utils/getToastMessage.ts";
import { ResetPasswordToast } from "../../presets/toast/index.ts";
import { NewPasswordRequest, useNewPasswordFormProps } from "../../schemas/form/newPasswordRequest.ts";
import Form from "../../../../components/Form/Form.tsx";
import React from "react";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useTranslation } from "react-i18next";
import { SubmitHandlerArgs } from "../../../../types/index.ts";
import { InvalidFormToast } from "../../../../ui/alert/presets/toast/index.ts";
import { View } from "react-native";
import { formTheme } from "../../../../ui/form/constants/theme.ts";
import { OtpVerificationHandlerType } from "../../hooks/useOtpVerificationHandler.ts";

type ResetPasswordFormProps = {
    defaultEmail?: string
    withEmailFormField?: boolean
    onFormStateChange?: (formState: FormState<NewPasswordRequest>) => void
}

export function ResetPasswordForm({ defaultEmail, withEmailFormField, onFormStateChange }: ResetPasswordFormProps) {
    const { t } = useTranslation();
    const { supabaseConnector } = useDatabase();
    const { openToast } = useAlert();

    const form = useForm<NewPasswordRequest>(useNewPasswordFormProps(defaultEmail));

    const submitHandler: SubmitHandlerArgs<NewPasswordRequest> = {
        onValid: async (request: NewPasswordRequest) => {
            try {
                const { error } = await supabaseConnector.client.auth.resetPasswordForEmail(request.email);

                if(error) throw error;

                router.push({
                    pathname: "bottomSheet/otpVerification",
                    params: {
                        type: "recovery",
                        title: t("auth.otp_verification.password_reset"),
                        newPassword: request.password,
                        email: request.email,
                        handlerType: OtpVerificationHandlerType.PasswordReset
                    }
                });
            } catch(error) {
                console.log("Reset password error: ", error);
                openToast(getToastMessage({ messages: ResetPasswordToast, error }));
            }
        },
        onInvalid: (errors) => {
            console.log("Reset password validation errors", errors);
            openToast(InvalidFormToast.warning());
        }
    };

    return (
        <Form
            edit
            form={ form }
            formFields={
                <View style={ { gap: formTheme.gap } }>
                    { withEmailFormField && <EmailStep { ...form } /> }
                    <PasswordStep { ...form }/>
                </View>
            }
            submitHandler={ submitHandler }
            onFormStateChange={ onFormStateChange }
        />
    );
}