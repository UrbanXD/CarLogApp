import { FormState } from "react-hook-form";
import React, { ReactElement, useState } from "react";
import BottomSheet, { BottomSheetProps } from "../components/BottomSheet.tsx";
import { heightPercentageToDP } from "react-native-responsive-screen";

type FormBottomSheetProps = BottomSheetProps & {
    alwaysEnableDismiss?: boolean
}

export function FormBottomSheet({
    enableDismissOnClose: defaultEnableDismissOnClose,
    content,
    enableDynamicSizing = false,
    snapPoints = !enableDynamicSizing ? ["90%"] : undefined,
    maxDynamicContentSize = heightPercentageToDP(90),
    alwaysEnableDismiss = defaultEnableDismissOnClose ?? false,
    ...bottomSheetProps
}: FormBottomSheetProps) {
    const [enableDismissOnClose, setEnableDismissOnClose] = useState(alwaysEnableDismiss);

    let contentWithCallback = content;
    if(!alwaysEnableDismiss && React.isValidElement(content) && content.props) {
        contentWithCallback = React.cloneElement(
            content as ReactElement<any>,
            {
                onFormStateChange: (formState: FormState<any>) => setEnableDismissOnClose(!formState.isDirty)
            }
        );
    }

    return (
        <BottomSheet
            { ...bottomSheetProps }
            content={ contentWithCallback ?? content }
            snapPoints={ enableDynamicSizing ? undefined : snapPoints }
            enableDynamicSizing={ enableDynamicSizing }
            maxDynamicContentSize={ maxDynamicContentSize }
            enableDismissOnClose={ enableDismissOnClose }
            enableOverDrag={ false }
        />
    );
}