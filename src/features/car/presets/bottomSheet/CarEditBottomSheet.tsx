import EditCarForm, {EditCarFormProps} from "../../components/forms/EditCarForm.tsx";
import React from "react";
import {OpenBottomSheetArgs} from "../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";

type CarEditBottomSheetArgs = EditCarFormProps & { height: string };

type CarEditBottomSheet = (args: CarEditBottomSheetArgs) => OpenBottomSheetArgs;

export const CarEditBottomSheet: CarEditBottomSheet = ({
    car,
    carImage,
    stepIndex,
    height
}) => {
    return {
        content:
            <EditCarForm
                car={ car }
                carImage={ carImage }
                stepIndex={ stepIndex }
            />,
        snapPoints: [height],
        enableDismissOnClose: false

    }
}