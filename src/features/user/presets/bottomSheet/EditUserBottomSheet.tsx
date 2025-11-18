import React from "react";
import { heightPercentageToDP } from "react-native-responsive-screen";
import BottomSheet from "../../../../ui/bottomSheet/components/BottomSheet.tsx";
import { EditUserInformationForm } from "../../components/forms/EditUserInformationForm.tsx";
import { UserAccount } from "../../schemas/userSchema.ts";
import { EditUserAvatarForm } from "../../components/forms/EditUserAvatarForm.tsx";
import { ChangeEmailForm } from "../../components/forms/ChangeEmailForm.tsx";
import { ResetPasswordForm } from "../../components/forms/ResetPasswordForm.tsx";
import { LinkPasswordToOAuthForm } from "../../components/forms/LinkPasswordToOAuthForm.tsx";

export enum EDIT_USER_FORM_TYPE {
    ChangeEmail,
    EditUserInformation,
    EditAvatar,
    ResetPassword,
    LinkPasswordToOAuth
}

type EditUserBottomSheetProps = {
    user: UserAccount
    type: EDIT_USER_FORM_TYPE
}

const EditUserBottomSheet: React.FC<EditUserBottomSheetProps> = ({ user, type }) => {
    let CONTENT = null;

    switch(type) {
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
            CONTENT = <ResetPasswordForm user={ user }/>;
            break;
        case EDIT_USER_FORM_TYPE.LinkPasswordToOAuth:
            CONTENT = <LinkPasswordToOAuthForm/>;
            break;
    }

    const MAX_DYNAMIC_CONTENT_SIZE = heightPercentageToDP(85);

    return (
        <BottomSheet
            content={ CONTENT }
            maxDynamicContentSize={ MAX_DYNAMIC_CONTENT_SIZE }
            enableDynamicSizing
            enableOverDrag={ false }
            enableDismissOnClose={ false }
        />
    );
};

export default EditUserBottomSheet;