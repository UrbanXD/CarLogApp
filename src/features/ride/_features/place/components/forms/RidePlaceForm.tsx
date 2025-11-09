import { RidePlaceFormFields, useRidePlaceFormProps } from "../../schemas/form/ridePlaceForm.ts";
import { RidePlace } from "../../schemas/ridePlaceSchema.ts";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useForm, useWatch } from "react-hook-form";
import { CarCreateToast } from "../../../../../car/presets/toast/index.ts";
import { PlaceInput } from "./inputFields/PlaceInput.tsx";
import { StyleSheet, View } from "react-native";
import { SaveButton } from "../../../../../../components/Button/presets/SaveButton.tsx";
import React, { useEffect } from "react";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../../../constants/index.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";

type RidePlaceFormProps = {
    onSubmit: (result: RidePlaceFormFields) => void
    defaultRidePlace?: RidePlace
}

export function RidePlaceForm({ onSubmit, defaultRidePlace }: RidePlaceFormProps) {
    const { openToast } = useAlert();
    const { placeDao } = useDatabase();

    const form = useForm<RidePlaceFormFields>(useRidePlaceFormProps(defaultRidePlace));
    const { control, setValue, handleSubmit } = form;

    const formPlaceId = useWatch({ control, name: "placeId" });

    useEffect(() => {
        (async () => {
            if(!formPlaceId) return;

            const place = await placeDao.getById(formPlaceId);
            setValue("name", place?.name);
        })();
    }, [formPlaceId]);

    const submitHandler = handleSubmit(
        async (formResult: RidePlaceFormFields) => {
            try {
                onSubmit(formResult);
            } catch(e) {
                openToast(CarCreateToast.error());
                console.error("Hiba a submitHandler-ben ride place:", e);
            }
        },
        (errors) => {
            console.log("Ride place form validation errors", errors);
            openToast(CarCreateToast.error());
        }
    );

    return (
        <View style={ styles.container }>
            <PlaceInput control={ control } fieldName="placeId" title={ "Hely" }/>
            <SaveButton onPress={ submitHandler }/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignSelf: "center",
        gap: SEPARATOR_SIZES.lightSmall
    },
    title: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p1,
        color: COLORS.white,
        textAlign: "center"
    }
});