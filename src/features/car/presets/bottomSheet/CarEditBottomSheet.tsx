import React from "react";
import { EditCarForm, EditCarFormProps } from "../../components/forms/EditCarForm.tsx";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { FormBottomSheet } from "../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";

type EditCarBottomSheetProps = Omit<EditCarFormProps, "onFormStateChange">;

const EditCarBottomSheet: React.FC<EditCarBottomSheetProps> = ({ car, stepIndex }) => {
    const CONTENT = <EditCarForm car={ car } stepIndex={ stepIndex }/>;
    const MAX_DYNAMIC_CONTENT_SIZE = heightPercentageToDP(85);

    return (
        <FormBottomSheet
            content={ CONTENT }
            maxDynamicContentSize={ MAX_DYNAMIC_CONTENT_SIZE }
            enableDynamicSizing
            enableDismissOnClose={ false }
        />
    );
};

export default EditCarBottomSheet;