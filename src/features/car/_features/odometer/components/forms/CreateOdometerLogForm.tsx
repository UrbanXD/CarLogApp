import React, { useEffect, useState } from "react";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useForm, useWatch } from "react-hook-form";
import { OdometerLogFields, useCreateOdometerLogFormProps } from "../../schemas/form/odometerLogForm.ts";
import { Car } from "../../../../schemas/carSchema.ts";
import Form from "../../../../../../components/Form/Form.tsx";
import useCars from "../../../../hooks/useCars.ts";
import Input from "../../../../../../components/Input/Input.ts";
import { ICON_NAMES, SEPARATOR_SIZES } from "../../../../../../constants/index.ts";
import InputDatePicker from "../../../../../../components/Input/datePicker/InputDatePicker.tsx";
import { CarCreateToast } from "../../../../presets/toast/index.ts";
import Button from "../../../../../../components/Button/Button.ts";
import { useAppDispatch } from "../../../../../../hooks/index.ts";
import { updateCarOdometer } from "../../../../model/slice/index.ts";
import { OdometerValueInput } from "./inputFields/OdometerValueInput.tsx";
import { CarPickerInput } from "../../../../components/forms/inputFields/CarPickerInput.tsx";

export function CreateOdometerLogForm() {
    const dispatch = useAppDispatch();
    const { odometerLogDao } = useDatabase();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();
    const { selectedCar, getCar } = useCars();

    const [car, setCar] = useState<Car | null>(selectedCar);

    const { control, handleSubmit, clearErrors, resetField, setValue } =
        useForm<OdometerLogFields>(useCreateOdometerLogFormProps(car));

    const formCarId = useWatch({ control, name: "carId" });

    useEffect(() => {
        const car = getCar(formCarId);
        setCar(car ?? null);
        setValue("conversionFactor", car?.odometer.unit.conversionFactor ?? 1);
        clearErrors();
    }, [formCarId]);

    useEffect(() => {
        setValue("value", car?.odometer.value ?? 0);
    }, [car?.odometer.value]);

    const submitHandler = handleSubmit(
        async (formResult: OdometerLogFields) => {
            try {
                const result = await odometerLogDao.create(formResult);
                dispatch(updateCarOdometer({ carId: result.carId, value: result.value }));

                openToast(CarCreateToast.success());

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(CarCreateToast.error());
                console.error("Hiba a submitHandler-ben log:", e);
            }
        },
        (errors) => {
            console.log("Create odometer log validation errors", errors);
            openToast(CarCreateToast.error());
        }
    );

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
                <Input.Field
                    control={ control }
                    fieldName="note"
                    fieldNameText="Megjegyzés"
                    optional
                >
                    <Input.Text
                        icon={ ICON_NAMES.note }
                        placeholder="Megjegyzés"
                        multiline
                        actionIcon={ ICON_NAMES.close }
                        onAction={ () => resetField("note") }
                    />
                </Input.Field>
            </Form>
            <Button.Text
                text={ "Rögizítés" }
                onPress={ submitHandler }
                style={ { width: "70%", alignSelf: "flex-end" } }
            />
        </>
    );
}