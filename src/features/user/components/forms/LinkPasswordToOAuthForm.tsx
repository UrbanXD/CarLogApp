import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { FormState, useForm } from "react-hook-form";
import { PasswordStep } from "./steps/index.ts";
import { getToastMessage } from "../../../../ui/alert/utils/getToastMessage.ts";
import { AddPasswordToast } from "../../presets/toast/index.ts";
import { NewPasswordRequest, useNewPasswordFormProps } from "../../schemas/form/newPasswordRequest.ts";
import { useAuth } from "../../../../contexts/auth/AuthContext.ts";
import Form from "../../../../components/Form/Form.tsx";
import React from "react";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { SubmitHandlerArgs } from "../../../../types/index.ts";
import { InvalidFormToast } from "../../../../ui/alert/presets/toast/index.ts";

type LinkPasswordToOAuthFormProps = {
    onFormStateChange?: (formState: FormState<NewPasswordRequest>) => void
}

export function LinkPasswordToOAuthForm({ onFormStateChange }: LinkPasswordToOAuthFormProps) {
    const { supabaseConnector } = useDatabase();
    const { openToast } = useAlert();
    const { hasPassword, refreshSession } = useAuth();

    const form = useForm<NewPasswordRequest>(useNewPasswordFormProps());

    const submitHandler: SubmitHandlerArgs<NewPasswordRequest> = {
        onValid: async (request) => {
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
        },
        onInvalid: (errors) => {
            console.log("Link password validation errors", errors);
            openToast(InvalidFormToast.warning());
        }
    };

    return (
        <Form
            edit
            form={ form }
            formFields={ <PasswordStep { ...form } /> }
            submitHandler={ submitHandler }
            onFormStateChange={ onFormStateChange }
        />
    );
}