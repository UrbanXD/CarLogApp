import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Car } from "../../../car/schemas/carSchema.ts";
import { FuelLogFormFields, useCreateFuelLogFormProps } from "../../../car/_features/fuel/schemas/form/fuelLogForm.ts";
import { FuelInput } from "../../../car/_features/fuel/components/forms/inputFields/FuelInput.tsx";
import {
    OdometerValueInput
} from "../../../car/_features/odometer/components/forms/inputFields/OdometerValueInput.tsx";
import { AmountInput } from "../../../_shared/currency/components/AmountInput.tsx";
import { NoteInput } from "../../../../components/Input/_presets/NoteInput.tsx";
import Form from "../../../../components/Form/Form.tsx";
import { SaveButton } from "../../../../components/Button/presets/SaveButton.tsx";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { InvalidFormToast } from "../../../../ui/alert/presets/toast";
import { COLORS, FONT_SIZES } from "../../../../constants";
import { formTheme } from "../../../../ui/form/constants/theme.ts";

type RideFuelLogFormProps = {
    car: Car
    onSubmit: (result: FuelLogFormFields) => void
    defaultFuelLog?: FuelLogFormFields
    defaultDate?: string
}

export function RideFuelLogForm({ car, onSubmit, defaultFuelLog, defaultDate }: RideFuelLogFormProps) {
    const { t } = useTranslation();
    const { openToast } = useAlert();
    const formProps = useCreateFuelLogFormProps(car, defaultDate);
    const form = useForm<FuelLogFormFields>(
        defaultFuelLog ? { ...formProps, defaultValues: defaultFuelLog } : formProps
    );
    const { control, setValue, getFieldState, handleSubmit } = form;

    const submit = handleSubmit(
        (result) => onSubmit(result),
        (errors) => {
            console.log("Ride fuel log form validation errors", errors);
            openToast(InvalidFormToast.warning());
        }
    );

    return (
        <View style={ styles.container }>
            <Text style={ styles.title }>{ t("fuel.fueling") }</Text>
            <Form
                form={ form }
                formFields={ [
                    <FuelInput
                        control={ control }
                        setValue={ setValue }
                        fieldName="quantity"
                        fuelUnitIdFieldName="fuelUnitId"
                        carIdFieldName="carId"
                    />,
                    <AmountInput
                        control={ control }
                        setValue={ setValue }
                        fieldName="expense"
                        carIdFieldName="carId"
                        outsideQuantityFieldName="quantity"
                        showsIsPricePerUnitInput
                        showsQuantityInput={ false }
                    />,
                    <OdometerValueInput
                        control={ control }
                        setValue={ setValue }
                        getFieldState={ getFieldState }
                        idFieldName="odometerLogId"
                        carIdFieldName="carId"
                        odometerValueFieldName="odometerValue"
                        dateFieldName="date"
                        odometerValueOptional
                    />,
                    <NoteInput control={ control } setValue={ setValue } fieldName="note"/>
                ] }
                containerStyle={ styles.formContainer }
            />
            <SaveButton onPress={ submit }/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignSelf: "center",
        gap: formTheme.gap
    },
    formContainer: {
        flex: 1,
        width: "100%",
        alignSelf: "center",
        gap: formTheme.gap,
        overflow: "hidden"
    },
    title: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p1,
        color: COLORS.white,
        textAlign: "center"
    }
});

