import React from "react";
import { Passenger } from "../../schemas/passengerSchema.ts";
import { CreatePassengerForm } from "../../components/forms/CreatePassengerForm.tsx";
import { EditPassengerForm } from "../../components/forms/EditPassengerForm.tsx";
import { useTranslation } from "react-i18next";
import { FormBottomSheet } from "../../../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";

type PassengerBottomSheetProps = {
    passenger?: Passenger
}

export function PassengerBottomSheet({ passenger }: PassengerBottomSheetProps) {
    const { t } = useTranslation();

    const TITLE = passenger ? undefined : t("passengers.create");
    const CONTENT = passenger ? <EditPassengerForm passenger={ passenger }/> : <CreatePassengerForm/>;

    return (
        <FormBottomSheet
            title={ TITLE }
            content={ CONTENT }
            enableDynamicSizing
        />
    );
}