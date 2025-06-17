import React from "react";
import { BottomSheetBackdrop as Backdrop } from "@gorhom/bottom-sheet";
import { COLORS } from "../../../constants/index.ts";

const BottomSheetBackdrop: React.FC<any> = (props) =>
    <Backdrop
        appearsOnIndex={ 0 }
        disappearsOnIndex={ -1 }
        opacity={ 0.6 }
        { ...props }
        style={ [props.style, { backgroundColor: COLORS.black }] }
    />

export default BottomSheetBackdrop;