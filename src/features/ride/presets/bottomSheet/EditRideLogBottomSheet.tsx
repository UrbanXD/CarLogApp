import { ServiceLogFormFieldsEnum } from "../../../expense/_features/service/enums/ServiceLogFormFieldsEnum.ts";
import React from "react";
import { RideLog } from "../../schemas/rideLogSchema.ts";
import { EditRideLogForm } from "../../components/forms/EditRideLogForm.tsx";
import { FormBottomSheet } from "../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";

type EditRideLogBottomSheetProps = {
    rideLog: RideLog,
    field: ServiceLogFormFieldsEnum
}

export function EditRideLogBottomSheet({ rideLog, field }: EditRideLogBottomSheetProps) {
    return (
        <FormBottomSheet
            content={ <EditRideLogForm rideLog={ rideLog } field={ field }/> }
            enableDynamicSizing
        />
    );
}