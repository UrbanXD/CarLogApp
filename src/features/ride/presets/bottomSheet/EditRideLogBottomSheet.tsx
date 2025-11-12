import { ServiceLogFormFieldsEnum } from "../../../expense/_features/service/enums/ServiceLogFormFieldsEnum.ts";
import { heightPercentageToDP } from "react-native-responsive-screen";
import BottomSheet from "../../../../ui/bottomSheet/components/BottomSheet.tsx";
import React from "react";
import { RideLog } from "../../schemas/rideLogSchema.ts";
import { EditRideLogForm } from "../../components/forms/EditRideLogForm.tsx";

type EditRideLogBottomSheetProps = {
    rideLog: RideLog,
    field: ServiceLogFormFieldsEnum
}

export function EditRideLogBottomSheet({ rideLog, field }: EditRideLogBottomSheetProps) {
    const CONTENT = <EditRideLogForm rideLog={ rideLog } field={ field }/>;
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
}