import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
    OdometerLogFields,
    useCreateOdometerLogFormProps,
    useEditOdometerLogFormProps
} from "../../schemas/form/odometerLogForm.ts";
import { Car } from "../../../../schemas/carSchema.ts";
import Form from "../../../../../../components/Form/Form.tsx";
import useCars from "../../../../hooks/useCars.ts";
import Input from "../../../../../../components/Input/Input.ts";
import { ICON_NAMES, SEPARATOR_SIZES } from "../../../../../../constants/index.ts";
import InputDatePicker from "../../../../../../components/Input/datePicker/InputDatePicker.tsx";
import Button from "../../../../../../components/Button/Button.ts";
import { OdometerValueInput } from "./inputFields/OdometerValueInput.tsx";
import { CarPickerInput } from "../../../../components/forms/inputFields/CarPickerInput.tsx";
import { NoteInput } from "../../../../../../components/Input/_presets/NoteInput.tsx";
import { useCreateOdometerLog } from "../../hooks/useCreateOdometerLog.ts";
import { OdometerLog } from "../../schemas/odometerLogSchema.ts";
import { useEditOdometerLog } from "../../hooks/useEditOdometerLog.ts";

export type OdometerLogFormProps = {
    /** Only for edit form */
    odometerLog?: OdometerLog
    /** Only for create form, used to set default selected car */
    defaultCarId?: string
}

export function OdometerLogForm({ odometerLog, defaultCarId }: OdometerLogFormProps) {
    const IS_EDIT_FORM = !!odometerLog;

    const { selectedCar, getCar } = useCars();

    const [car, setCar] = useState<Car | null>(defaultCarId ? getCar(defaultCarId) ?? selectedCar : selectedCar);

    const { control, handleSubmit, clearErrors, resetField, setValue, reset } =
        useForm<OdometerLogFields>(
            IS_EDIT_FORM
            ? useEditOdometerLogFormProps(odometerLog)
            : useCreateOdometerLogFormProps(car)
        );
    const { submitHandler } = IS_EDIT_FORM ? useEditOdometerLog(handleSubmit) : useCreateOdometerLog(handleSubmit);

    const formCarId = useWatch({ control, name: "carId" });

    useEffect(() => {
        const car = getCar(formCarId);
        setCar(car ?? null);
        setValue("conversionFactor", car?.odometer.unit.conversionFactor ?? 1);
        clearErrors();
    }, [formCarId]);

    useEffect(() => {
        if(IS_EDIT_FORM) return; // prevent update odometer value when form is for edit

        setValue("value", car?.odometer.value ?? 0);
    }, [car?.odometer.value]);

    return (
        <>
            <Form containerStyle={ { paddingBottom: SEPARATOR_SIZES.small } }>
                <CarPickerInput
                    control={ control }
                    fieldName="carId"
                />
                <OdometerValueInput
                    control={ control }
                    fieldName="value"
                    fieldInfoText={ IS_EDIT_FORM && `Bejegyzés eredeti kilométeróra-állása: ${ odometerLog.value } ${ odometerLog.unit.short }` }
                    currentOdometerValue={ car?.odometer.value }
                    unitText={ car?.odometer.unit.short }
                />
                <Input.Field
                    control={ control }
                    fieldName="date"
                    fieldNameText="Dátum"
                >
                    <InputDatePicker/>
                </Input.Field>
                <NoteInput
                    control={ control }
                    setValue={ setValue }
                    fieldName="note"
                />
            </Form>
            <Button.Row style={ { justifyContent: IS_EDIT_FORM ? "space-between" : "flex-end" } }>
                {
                    IS_EDIT_FORM &&
                   <Button.Icon
                      icon={ ICON_NAMES.reset }
                      onPress={ () => reset() }
                   />
                }
                <Button.Text
                    text={ IS_EDIT_FORM ? "Mentés" : "Rögizítés" }
                    onPress={ submitHandler }
                    style={ { width: "75%" } }
                />
            </Button.Row>
        </>
    );
}