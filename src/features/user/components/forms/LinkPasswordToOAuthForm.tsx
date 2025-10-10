import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useForm } from "react-hook-form";
import { PasswordStep } from "./steps/index.ts";
import { getToastMessage } from "../../../../ui/alert/utils/getToastMessage.ts";
import { AddPasswordToast } from "../../presets/toast/index.ts";
import { NewPasswordRequest, useNewPasswordFormProps } from "../../schemas/form/newPasswordRequest.ts";
import { useAuth } from "../../../../contexts/auth/AuthContext.ts";
import Form from "../../../../components/Form/Form.tsx";
import { EditFormButtons } from "../../../../components/Button/presets/EditFormButtons.tsx";
import React from "react";

export function LinkPasswordToOAuthForm() {
    const { openToast } = useAlert();
    const { hasPassword, refreshSession } = useAuth();

    const {
        control,
        handleSubmit,
        reset
    } = useForm<NewPasswordRequest>(useNewPasswordFormProps());

    const submitHandler = handleSubmit(async (request: NewPasswordRequest) => {
        try {
            if(hasPassword) throw { code: "has_password" };

            const { error } = await supabaseConnector.client.auth.updateUser({ password: request.password });

            if(error) throw error;

            openToast(AddPasswordToast.success());
            await refreshSession();
        } catch(error) {
            openToast(getToastMessage({ messages: AddPasswordToast, error }));
        }
    });

    return (
        <Form>
            <PasswordStep control={ control }/>
            <EditFormButtons reset={ reset } submit={ submitHandler }/>
        </Form>
    );
}