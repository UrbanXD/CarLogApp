import BottomSheet from "../../../../../../ui/bottomSheet/components/BottomSheet.tsx";
import React from "react";
import { Passenger } from "../../schemas/passengerSchema.ts";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { CreatePassengerForm } from "../../components/forms/CreatePassengerForm.tsx";
import { EditPassengerForm } from "../../components/forms/EditPassengerForm.tsx";
import { useTranslation } from "react-i18next";

type PassengerBottomSheetProps = {
    passenger?: Passenger
}

export function PassengerBottomSheet({ passenger }: PassengerBottomSheetProps) {
    const { t } = useTranslation();

    const TITLE = passenger ? undefined : t("passengers.create");
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