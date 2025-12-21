import { FormBottomSheet } from "../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";
import { ResetPasswordForm } from "../../components/forms/ResetPasswordForm.tsx";
import { useTranslation } from "react-i18next";

type ResetPasswordBottomSheetProps = {
    email?: string
}

export function ResetPasswordBottomSheet({ email }: ResetPasswordBottomSheetProps) {
    const { t } = useTranslation();

    return (
        <FormBottomSheet
            title={ t("auth.password_recovery") }
            content={ <ResetPasswordForm withEmailFormField defaultEmail={ email }/> }
            enableDynamicSizing
        />
    );
}