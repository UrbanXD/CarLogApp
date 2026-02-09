import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { FormState, useForm } from "react-hook-form";
import { UserAccount } from "../../schemas/userSchema.ts";
import { EmailStep } from "./steps/index.ts";
import { router } from "expo-router";
import { getToastMessage } from "../../../../ui/alert/utils/getToastMessage.ts";
import { ChangeEmailToast } from "../../presets/toast/index.ts";
import { ChangeEmailRequest, useChangeEmailFormProps } from "../../schemas/form/changeEmailRequest.ts";
import Form from "../../../../components/Form/Form.tsx";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useTranslation } from "react-i18next";
import { SubmitHandlerArgs } from "../../../../types/index.ts";
import { InvalidFormToast } from "../../../../ui/alert/presets/toast/index.ts";
import { OtpVerificationHandlerType } from "../../hooks/useOtpVerificationHandler.ts";

export type ChangeEmailFormProps = {
    user: UserAccount
    onFormStateChange?: (formState: FormState<ChangeEmailRequest>) => void
}

export function ChangeEmailForm({ user, onFormStateChange }: ChangeEmailFormProps) {
    const { t } = useTranslation();
    const { supabaseConnector } = useDatabase();
    const { openToast } = useAlert();

    const form = useForm<ChangeEmailRequest>(useChangeEmailFormProps({ email: user.email }));

    const submitHandler: SubmitHandlerArgs<ChangeEmailRequest> = {
        onValid: async (request) => {
            try {
                const { error } = await supabaseConnector.client.auth.updateUser({ email: request.email });

                if(error) throw error;

                router.push({
                    pathname: "bottomSheet/otpVerification",
                    params: {
                        type: "email_change",
                        title: t("auth.otp_verification.email_change"),
                        email: user.email, //current email
                        newEmail: request.email,
                        handlerType: OtpVerificationHandlerType.CurrentEmailChange
                    }
                });
            } catch(error) {
                console.log("Change Email error: ", error);
                openToast(getToastMessage({ messages: ChangeEmailToast, error }));
            }
        },
        onInvalid: (errors) => {
            console.log("Edit email change validation errors", errors);
            openToast(InvalidFormToast.warning());
        }
    };

    return (
        <Form
            edit
            form={ form }
            formFields={ <EmailStep { ...form } /> }
            submitHandler={ submitHandler }
            onFormStateChange={ onFormStateChange }
        />
    );
}