import React from "react";
import EditCarForm, { EditCarFormProps } from "../../components/forms/EditCarForm.tsx";
import { heightPercentageToDP } from "react-native-responsive-screen";
import BottomSheet from "../../../../ui/bottomSheet/components/BottomSheet.tsx";

type EditCarBottomSheetProps = EditCarFormProps;

const EditCarBottomSheet: React.FC<EditCarBottomSheetProps> = ({ car, stepIndex }) => {
    const CONTENT = <EditCarForm car={ car } stepIndex={ stepIndex }/>;
    const MAX_DYNAMIC_CONTENT_SIZE = heightPercentageToDP(85);

    return (
        <BottomSheet
            content={ CONTENT }
            maxDynamicContentSize={ MAX_DYNAMIC_CONTENT_SIZE }
            enableDynamicSizing
            enableDismissOnClose={ false }
            enableOverDrag={ false }
        />
    );
};

export default EditCarBottomSheet;