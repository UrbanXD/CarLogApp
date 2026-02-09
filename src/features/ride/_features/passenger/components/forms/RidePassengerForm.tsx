import {
    RidePassengerDefaultValues,
    RidePassengerFormFields,
    useRidePassengerFormProps
} from "../../schemas/form/ridePassengerForm.ts";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { useForm, useWatch } from "react-hook-form";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SaveButton } from "../../../../../../components/Button/presets/SaveButton.tsx";
import { SEPARATOR_SIZES } from "../../../../../../constants/index.ts";
import { PassengerInput } from "./inputFields/PassengerInput.tsx";
import { useTranslation } from "react-i18next";
import { ArrayInputToast, InvalidFormToast } from "../../../../../../ui/alert/presets/toast/index.ts";

type RidePassengerFormProps = {
    onSubmit: (result: RidePassengerFormFields) => void
    defaultRidePassenger?: RidePassengerFormFields | null
}

export function RidePassengerForm({ onSubmit, defaultRidePassenger }: RidePassengerFormProps) {
    const { t } = useTranslation();
    const { openToast } = useAlert();
    const { passengerDao } = useDatabase();

    const form = useForm<RidePassengerDefaultValues, any, RidePassengerFormFields>(useRidePassengerFormProps(
        defaultRidePassenger));
    const { control, setValue, handleSubmit } = form;

    const formPassengerId = useWatch({ control, name: "passengerId" });

    useEffect(() => {
        (async () => {
            if(!formPassengerId) return;

            const passenger = await passengerDao.getById(formPassengerId);
            setValue("name", passenger?.name ?? "");
        })();
    }, [formPassengerId]);

    const submitHandler = handleSubmit(
        async (formResult) => {
            try {
                onSubmit(formResult);
            } catch(e) {
                openToast(ArrayInputToast.error());
                console.error("Hiba a submitHandler-ben ride passenger:", e);
            }
        },
        (errors) => {
            console.log("Ride passenger form validation errors", errors);
            openToast(InvalidFormToast.warning());
        }
    );

    return (
        <View style={ styles.container }>
            <PassengerInput control={ control } fieldName="passengerId" title={ t("passengers.title_singular") }/>
            <SaveButton onPress={ submitHandler }/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignSelf: "center",
        gap: SEPARATOR_SIZES.lightSmall
    }
});