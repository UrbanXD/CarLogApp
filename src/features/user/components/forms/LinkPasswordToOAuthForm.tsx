import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useForm } from "react-hook-form";
import { PasswordStep } from "./steps/index.ts";
import { getToastMessage } from "../../../../ui/alert/utils/getToastMessage.ts";
import { AddPasswordToast } from "../../presets/toast/index.ts";
import { NewPasswordRequest, useNewPasswordFormProps } from "../../schemas/form/newPasswordRequest.ts";
import { useAuth } from "../../../../contexts/auth/AuthContext.ts";
import Form from "../../../../components/Form/Form.tsx";
import { FormButtons } from "../../../../components/Button/presets/FormButtons.tsx";
import React from "react";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";

export function LinkPasswordToOAuthForm() {
    const { supabaseConnector } = useDatabase();
    const { openToast } = useAlert();
    const { hasPassword, refreshSession } = useAuth();

    const form = useForm<NewPasswordRequest>(useNewPasswordFormProps());
    const { reset, handleSubmit } = form;

    const submitHandler = handleSubmit(async (request: NewPasswordRequest) => {
        try {
            if(hasPassword) throw { code: "has_password" };

            const { error } = await supabaseConnector.client.auth.updateUser({ password: request.password });

            if(error) throw error;

            openToast(AddPasswordToast.success());
            await refreshSession();
        } catch(error) {
            console.log("Link Password error: ", error);
            openToast(getToastMessage({ messages: AddPasswordToast, error }));
        }
    });

    return (
        <Form>
            <PasswordStep { ...form } />
            <FormButtons reset={ reset } submit={ submitHandler }/>
        </Form>
    );
}