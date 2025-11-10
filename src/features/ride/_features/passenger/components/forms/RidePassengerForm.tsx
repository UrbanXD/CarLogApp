import { RidePassengerFormFields, useRidePassengerFormProps } from "../../schemas/form/ridePassengerForm.ts";
import { RidePassenger } from "../../schemas/ridePassengerSchema.ts";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { useForm, useWatch } from "react-hook-form";
import { RidePlaceFormFields } from "../../../place/schemas/form/ridePlaceForm.ts";
import React, { useEffect } from "react";
import { CarCreateToast } from "../../../../../car/presets/toast/index.ts";
import { StyleSheet, View } from "react-native";
import { SaveButton } from "../../../../../../components/Button/presets/SaveButton.tsx";
import { SEPARATOR_SIZES } from "../../../../../../constants/index.ts";
import { PassengerInput } from "./inputFields/PassengerInput.tsx";

type RidePassengerFormProps = {
    onSubmit: (result: RidePassengerFormFields) => void
    defaultRidePassenger?: RidePassenger
}

export function RidePassengerForm({ onSubmit, defaultRidePassenger }: RidePassengerFormProps) {
    const { openToast } = useAlert();
    const { passengerDao } = useDatabase();

    const form = useForm<RidePlaceFormFields>(useRidePassengerFormProps(defaultRidePassenger));
    const { control, setValue, handleSubmit } = form;

    const formPassengerId = useWatch({ control, name: "passengerId" });

    useEffect(() => {
        (async () => {
            if(!formPassengerId) return;

            const passenger = await passengerDao.getById(formPassengerId);
            setValue("name", passenger?.name);
        })();
    }, [formPassengerId]);

    const submitHandler = handleSubmit(
        async (formResult: RidePassengerFormFields) => {
            try {
                onSubmit(formResult);
            } catch(e) {
                openToast(CarCreateToast.error());
                console.error("Hiba a submitHandler-ben ride passenger:", e);
            }
        },
        (errors) => {
            console.log("Ride passenger form validation errors", errors);
            openToast(CarCreateToast.error());
        }
    );

    return (
        <View style={ styles.container }>
            <PassengerInput control={ control } fieldName="passengerId" title={ "Utas" }/>
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