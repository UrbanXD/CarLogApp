import React from "react";
import { EditUserInformationForm } from "../../components/forms/EditUserInformationForm.tsx";
import { EditUserAvatarForm } from "../../components/forms/EditUserAvatarForm.tsx";
import { ChangeEmailForm } from "../../components/forms/ChangeEmailForm.tsx";
import { ResetPasswordForm } from "../../components/forms/ResetPasswordForm.tsx";
import { LinkPasswordToOAuthForm } from "../../components/forms/LinkPasswordToOAuthForm.tsx";
import { FormBottomSheet } from "../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { useUser } from "../../hooks/useUser.ts";
import { useFormBottomSheetGuard } from "../../../../hooks/useFormBottomSheetGuard.ts";

export enum EDIT_USER_FORM_TYPE {
    ChangeEmail,
    EditUserInformation,
    EditAvatar,
    ResetPassword,
    LinkPasswordToOAuth
}

export function EditUserBottomSheet() {
    const { type } = useLocalSearchParams<{ type?: string }>();
    const { t } = useTranslation();
    const { user, isLoading } = useUser();

    const { fieldValue, isValidField } = useFormBottomSheetGuard({
        data: user,
        isLoading,
        field: type,
        enumObject: EDIT_USER_FORM_TYPE,
        notFoundText: t("user.title")
    });

    if(!isValidField) return null;

    let CONTENT = null;

    if(user) {
        switch(fieldValue) {
            case EDIT_USER_FORM_TYPE.EditUserInformation:
                CONTENT = <EditUserInformationForm user={ user }/>;
                break;
            case EDIT_USER_FORM_TYPE.EditAvatar:
                CONTENT = <EditUserAvatarForm user={ user }/>;
                break;
            case EDIT_USER_FORM_TYPE.ChangeEmail:
                CONTENT = <ChangeEmailForm user={ user }/>;
                break;
            case EDIT_USER_FORM_TYPE.ResetPassword:
                CONTENT = <ResetPasswordForm defaultEmail={ user.email }/>;
                break;
            case EDIT_USER_FORM_TYPE.LinkPasswordToOAuth:
                CONTENT = <LinkPasswordToOAuthForm/>;
                break;
        }
    }

    return (
        <FormBottomSheet
            content={ CONTENT }
            enableDynamicSizing
            isLoading={ isLoading }
        />
    );
}