import React from "react";
import { RideLog } from "../../schemas/rideLogSchema.ts";
import { EditRideLogForm } from "../../components/forms/EditRideLogForm.tsx";
import { FormBottomSheet } from "../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";
import { RideLogFormFieldsEnum } from "../../enums/RideLogFormFields.ts";

type EditRideLogBottomSheetProps = {
    rideLog: RideLog,
    field: RideLogFormFieldsEnum
}

export function EditRideLogBottomSheet({ rideLog, field }: EditRideLogBottomSheetProps) {
    return (
        <FormBottomSheet
            content={ <EditRideLogForm rideLog={ rideLog } field={ field }/> }
            enableDynamicSizing
        />
    );
}