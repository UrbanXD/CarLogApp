import BottomSheet from "../../../../../../ui/bottomSheet/components/BottomSheet.tsx";
import React from "react";
import { Passenger } from "../../schemas/passengerSchema.ts";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { CreatePassengerForm } from "../../components/forms/CreatePassengerForm.tsx";
import { EditPassengerForm } from "../../components/forms/EditPassengerForm.tsx";

type PassengerBottomSheetProps = {
    passenger?: Passenger
}

export function PassengerBottomSheet({ passenger }: PassengerBottomSheetProps) {
    const TITLE = passenger ? undefined : "Utas létrehozása";
    const CONTENT = passenger ? <EditPassengerForm passenger={ passenger }/> : <CreatePassengerForm/>;
    const MAX_DYNAMIC_CONTENT_SIZE = heightPercentageToDP(85);

    return (
        <BottomSheet
            title={ TITLE }
            content={ CONTENT }
            maxDynamicContentSize={ MAX_DYNAMIC_CONTENT_SIZE }
            enableDynamicSizing
            enableDismissOnClose={ false }
            enableOverDrag={ false }
        />
    );
}