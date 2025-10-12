import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useForm } from "react-hook-form";
import { UserAccount } from "../../schemas/userSchema.ts";
import { PasswordStep } from "./steps/index.ts";
import { router } from "expo-router";
import { getToastMessage } from "../../../../ui/alert/utils/getToastMessage.ts";
import { ResetPasswordToast } from "../../presets/toast/index.ts";
import { OtpVerificationHandlerType } from "../../../../app/bottomSheet/otpVerification.tsx";
import { NewPasswordRequest, useNewPasswordFormProps } from "../../schemas/form/newPasswordRequest.ts";
import Form from "../../../../components/Form/Form.tsx";
import { FormButtons } from "../../../../components/Button/presets/FormButtons.tsx";
import React from "react";

export type ResetPasswordFormProps = { user: UserAccount }

export function ResetPasswordForm({ user }: ResetPasswordFormProps) {
    const { openToast } = useAlert();

    const {
        control,
        handleSubmit,
        reset
    } = useForm<NewPasswordRequest>(useNewPasswordFormProps());

    const submitHandler = handleSubmit(async (request: NewPasswordRequest) => {
        try {
            const { error } = await supabaseConnector.client.auth.resetPasswordForEmail(user.email);

            if(error) throw error;

            router.push({
                pathname: "bottomSheet/otpVerification",
                params: {
                    type: "recovery",
                    title: "Jelszó módosítása",
                    newPassword: request.password,
                    email: user.email,
                    handlerType: OtpVerificationHandlerType.PasswordReset
                }
            });
        } catch(error) {
            openToast(getToastMessage({ messages: ResetPasswordToast, error }));
        }
    });

    return (
        <Form>
            <PasswordStep control={ control }/>
            <FormButtons reset={ reset } submit={ submitHandler }/>
        </Form>
    );
}