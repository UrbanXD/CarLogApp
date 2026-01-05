import { RidePlaceFormFields, useRidePlaceFormProps } from "../../schemas/form/ridePlaceForm.ts";
import { RidePlace } from "../../schemas/ridePlaceSchema.ts";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useForm, useWatch } from "react-hook-form";
import { PlaceInput } from "./inputFields/PlaceInput.tsx";
import { StyleSheet, View } from "react-native";
import { SaveButton } from "../../../../../../components/Button/presets/SaveButton.tsx";
import React, { useEffect } from "react";
import { COLORS, FONT_SIZES } from "../../../../../../constants/index.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { useTranslation } from "react-i18next";
import { ArrayInputToast, InvalidFormToast } from "../../../../../../ui/alert/presets/toast/index.ts";
import { formTheme } from "../../../../../../ui/form/constants/theme.ts";

type RidePlaceFormProps = {
    onSubmit: (result: RidePlaceFormFields) => void
    defaultRidePlace?: RidePlace
}

export function RidePlaceForm({ onSubmit, defaultRidePlace }: RidePlaceFormProps) {
    const { t } = useTranslation();
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
                openToast(ArrayInputToast.error());
                console.error("Hiba a submitHandler-ben ride place:", e);
            }
        },
        (errors) => {
            console.log("Ride place form validation errors", errors);
            openToast(InvalidFormToast.warning());
        }
    );

    return (
        <View style={ styles.container }>
            <PlaceInput control={ control } fieldName="placeId" title={ t("places.title_singular") }/>
            <SaveButton onPress={ submitHandler }/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignSelf: "center",
        gap: formTheme.gap
    },
    title: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p1,
        color: COLORS.white,
        textAlign: "center"
    }
});