import React from "react";
import { BottomSheetBackdrop as Backdrop } from "@gorhom/bottom-sheet";
import { theme } from "../../core/constants/theme";

const BottomSheetBackdrop: React.FC<any> = (props) =>
    <Backdrop
        appearsOnIndex={ 0 }
        disappearsOnIndex={ -1 }
        opacity={ 0.6 }
        { ...props }
        style={ [props.style, { backgroundColor: theme.colors.black }] }
    />

export default BottomSheetBackdrop;