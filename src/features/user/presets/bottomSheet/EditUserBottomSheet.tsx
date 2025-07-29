import React from "react";
import { EditUserForm, EditUserFormProps } from "../../components/forms/EditUserForm.tsx";
import { heightPercentageToDP } from "react-native-responsive-screen";
import BottomSheet from "../../../../ui/bottomSheet/components/BottomSheet.tsx";

type EditUserBottomSheetProps = EditUserFormProps

const EditUserBottomSheet: React.FC<EditUserBottomSheetProps> = ({ user, passwordReset, stepIndex }) => {
    const CONTENT = <EditUserForm user={ user } passwordReset={ passwordReset } stepIndex={ stepIndex }/>;
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