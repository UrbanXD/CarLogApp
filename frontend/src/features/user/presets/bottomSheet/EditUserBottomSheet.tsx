import React from "react";
import { heightPercentageToDP } from "react-native-responsive-screen";
import BottomSheet from "../../../../ui/bottomSheet/components/BottomSheet.tsx";
import { EditUserNameForm } from "../../components/forms/EditUserNameForm.tsx";
import { User } from "../../schemas/userSchema.tsx";
import { EDIT_USER_FORM_STEPS } from "../../hooks/useEditUserSteps.tsx";

type EditUserBottomSheetProps = {
    user: User
    step: EDIT_USER_FORM_STEPS
}

const EditUserBottomSheet: React.FC<EditUserBottomSheetProps> = ({ user, step }) => {
    let CONTENT = null;

    switch(step) {
        case EDIT_USER_FORM_STEPS.NameStep:
            CONTENT = <EditUserNameForm user={ user }/>;
            break;
        case EDIT_USER_FORM_STEPS.AvatarStep:
            break;
        case EDIT_USER_FORM_STEPS.EmailStep:
            break;
        case EDIT_USER_FORM_STEPS.PasswordStep:
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