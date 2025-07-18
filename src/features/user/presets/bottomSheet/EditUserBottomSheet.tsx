import React, { useCallback, useRef } from "react";
import { EditUserForm, EditUserFormProps } from "../../components/forms/EditUserForm.tsx";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { router, useFocusEffect } from "expo-router";
import BottomSheet from "../../../../ui/bottomSheet/components/BottomSheet.tsx";

type EditUserBottomSheetProps = EditUserFormProps

const EditUserBottomSheet: React.FC<EditUserBottomSheetProps> = ({ user, passwordReset, stepIndex }) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const CONTENT = <EditUserForm user={ user } passwordReset={ passwordReset } stepIndex={ stepIndex }/>;
    const MAX_DYNAMIC_CONTENT_SIZE = heightPercentageToDP(85);

    useFocusEffect(useCallback(() => {
        bottomSheetRef.current.present();

        return () => bottomSheetRef.current?.close();
    }, []));

    const onBottomSheetDismiss = () => router.dismiss();

    return (
        <BottomSheet
            ref={ bottomSheetRef }
            content={ CONTENT }
            maxDynamicContentSize={ MAX_DYNAMIC_CONTENT_SIZE }
            enableDynamicSizing
            enableOverDrag={ false }
            // enableDismissOnClose={ false }
            onDismiss={ onBottomSheetDismiss }
        />
    );
};

export default EditUserBottomSheet;