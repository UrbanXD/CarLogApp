import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useForm } from "react-hook-form";
import { EditUserNameRequest } from "../../schemas/form/editUserNameRequest.ts";
import { UserAccount } from "../../schemas/userSchema.ts";
import { EmailStep } from "./steps/index.ts";
import { router } from "expo-router";
import { getToastMessage } from "../../../../ui/alert/utils/getToastMessage.ts";
import { ChangeEmailToast } from "../../presets/toast/index.ts";
import { OtpVerificationHandlerType } from "../../../../app/bottomSheet/otpVerification.tsx";
import { ChangeEmailRequest, useChangeEmailFormProps } from "../../schemas/form/changeEmailRequest.ts";
import Form from "../../../../components/Form/Form.tsx";
import { EditFormButtons } from "../../../../components/Button/presets/EditFormButtons.tsx";

export type ChangeEmailFormProps = { user: UserAccount }

export function ChangeEmailForm({ user }: ChangeEmailFormProps) {
    const { openToast } = useAlert();

    const {
        control,
        handleSubmit,
        reset
    } = useForm<EditUserNameRequest>(useChangeEmailFormProps({ email: user.email }));

    const submitHandler = handleSubmit(async (request: ChangeEmailRequest) => {
        try {
            const { error } = await supabaseConnector.client.auth.updateUser({ email: request.email });

            if(error) throw error;

            router.push({
                pathname: "bottomSheet/otpVerification",
                params: {
                    type: "email_change",
                    title: "Email módosítási kérelem hitelesítés",
                    email: user.email, //current email
                    newEmail: request.email,
                    handlerType: OtpVerificationHandlerType.CurrentEmailChange
                }
            });
        } catch(error) {
            openToast(getToastMessage({ messages: ChangeEmailToast, error }));
        }
    });

    return (
        <Form>
            <EmailStep control={ control }/>
            <EditFormButtons reset={ reset } submit={ submitHandler }/>
        </Form>
    );
}