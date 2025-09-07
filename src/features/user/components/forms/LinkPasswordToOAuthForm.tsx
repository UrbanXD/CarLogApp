import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useForm } from "react-hook-form";
import EditForm from "../../../../components/Form/EditForm.tsx";
import { PasswordStep } from "./steps/index.ts";
import { getToastMessage } from "../../../../ui/alert/utils/getToastMessage.ts";
import { AddPasswordToast } from "../../presets/toast/index.ts";
import { NewPasswordRequest, useNewPasswordFormProps } from "../../schemas/form/newPasswordRequest.ts";
import { useAuth } from "../../../../contexts/auth/AuthContext.ts";

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
        <EditForm
            renderInputFields={ () => <PasswordStep control={ control }/> }
            submitHandler={ submitHandler }
            reset={ reset }
        />
    );
}