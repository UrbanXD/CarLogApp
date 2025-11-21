import { UseFormReturn, useWatch } from "react-hook-form";
import { RideLogFormFields } from "../schemas/form/rideLogForm.ts";
import React, { useEffect, useMemo, useState } from "react";
import { Car } from "../../car/schemas/carSchema.ts";
import useCars from "../../car/hooks/useCars.ts";
import { RideLogFormFieldsEnum } from "../enums/RideLogFormFields.ts";
import { FormFields, Steps } from "../../../types/index.ts";
import { CarPickerInput } from "../../car/components/forms/inputFields/CarPickerInput.tsx";
import { CarEditNameToast } from "../../car/presets/toast/index.ts";
import { RidePlaceInput } from "../_features/place/components/forms/inputFields/RidePlaceInput.tsx";
import { OdometerValueInput } from "../../car/_features/odometer/components/forms/inputFields/OdometerValueInput.tsx";
import Input from "../../../components/Input/Input.ts";
import InputDatePicker from "../../../components/Input/datePicker/InputDatePicker.tsx";
import { NoteInput } from "../../../components/Input/_presets/NoteInput.tsx";
import { RidePassengerInput } from "../_features/passenger/components/forms/inputFields/RidePassengerInput.tsx";
import { RideExpenseInput } from "../_features/rideExpense/components/forms/inputFields/RideExpenseInput.tsx";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

type UseRideLogFormFieldsProps = {
    form: UseFormReturn<RideLogFormFields>
    setCarOdometerValueWhenInputNotTouched?: boolean
}

export function useRideLogFormFields({
    form,
    setCarOdometerValueWhenInputNotTouched = true
}: UseRideLogFormFieldsProps) {
    const { control, setValue, getFieldState, clearErrors } = form;
    const { t } = useTranslation();
    const { getCar } = useCars();

    const [car, setCar] = useState<Car | null>(null);

    const formCarId = useWatch({ control, name: "carId" });
    const formStartOdometerValue = useWatch({ control, name: "startOdometerValue" });
    const formStartTime = useWatch({ control, name: "startTime" });

    useEffect(() => {
        const car = getCar(formCarId);
        setCar(car ?? null);
        if(car && !getFieldState("startOdometerValue").isDirty && setCarOdometerValueWhenInputNotTouched) {
            setValue("startOdometerValue", car.odometer.value);
        }
        clearErrors();
    }, [formCarId]);

    useEffect(() => {
        if(formStartOdometerValue && !getFieldState("endOdometerValue").isDirty && setCarOdometerValueWhenInputNotTouched) {
            setValue("endOdometerValue", formStartOdometerValue);
        }
    }, [formStartOdometerValue]);

    const fields: Record<RideLogFormFieldsEnum, FormFields> = useMemo(() => ({
        [RideLogFormFieldsEnum.Car]: {
            render: () => <CarPickerInput control={ control } fieldName="carId"/>,
            editToastMessages: CarEditNameToast
        },
        [RideLogFormFieldsEnum.Expenses]: {
            render: () => <RideExpenseInput
                control={ control }
                fieldName="expenses"
                carIdFieldName="carId"
                startTimeFieldName="startTime"
            />,
            editToastMessages: CarEditNameToast
        },
        [RideLogFormFieldsEnum.Places]: {
            render: () => <RidePlaceInput control={ control } fieldName="places"/>,
            editToastMessages: CarEditNameToast
        },
        [RideLogFormFieldsEnum.Passengers]: {
            render: () => <RidePassengerInput control={ control } fieldName="passengers"/>,
            editToastMessages: CarEditNameToast
        },
        [RideLogFormFieldsEnum.StartOdometer]: {
            render: () => <OdometerValueInput
                control={ control }
                fieldName="startOdometerValue"
                title={ t("rides.start_odometer") }
                currentOdometerValue={ car?.odometer.value }
                unitText={ car?.odometer.unit.short }
            />,
            editToastMessages: CarEditNameToast
        },
        [RideLogFormFieldsEnum.EndOdometer]: {
            render: () => <OdometerValueInput
                control={ control }
                fieldName="endOdometerValue"
                title={ t("rides.end_odometer") }
                subtitle={ t(
                    "rides.start_odometer_value",
                    { value: `${ formStartOdometerValue } ${ car?.odometer.unit.short }` }
                ) }
                unitText={ car?.odometer.unit.short }
            />,
            editToastMessages: CarEditNameToast
        },
        [RideLogFormFieldsEnum.StartTime]: {
            render: () => (
                <Input.Field
                    control={ control }
                    fieldName="startTime"
                    fieldNameText={ t("rides.start") }
                >
                    <InputDatePicker/>
                </Input.Field>
            ),
            editToastMessages: CarEditNameToast
        },
        [RideLogFormFieldsEnum.EndTime]: {
            render: () => (
                <Input.Field
                    control={ control }
                    fieldName="endTime"
                    fieldNameText={ t("rides.end") }
                    fieldInfoText={ t(
                        "rides.start_time_value",
                        { value: `${ dayjs(formStartTime).format("YYYY. MM. DD. HH:mm") }` }
                    ) }
                >
                    <InputDatePicker/>
                </Input.Field>
            ),
            editToastMessages: CarEditNameToast
        },
        [RideLogFormFieldsEnum.Time]: {
            render: () => (
                <Input.Group>
                    <Input.Field
                        control={ control }
                        fieldName="startTime"
                        fieldNameText={ t("rides.start") }
                    >
                        <InputDatePicker/>
                    </Input.Field>
                    <Input.Field
                        control={ control }
                        fieldName="endTime"
                        fieldNameText={ t("rides.end") }
                    >
                        <InputDatePicker/>
                    </Input.Field>
                </Input.Group>
            ),
            editToastMessages: CarEditNameToast
        },
        [RideLogFormFieldsEnum.Odometer]: {
            render: () => (
                <Input.Group>
                    <OdometerValueInput
                        control={ control }
                        fieldName="startOdometerValue"
                        title={ t("rides.start_odometer") }
                        currentOdometerValue={ car?.odometer.value }
                        unitText={ car?.odometer.unit.short }
                    />
                    <OdometerValueInput
                        control={ control }
                        fieldName="endOdometerValue"
                        title={ t("rides.end_odometer") }
                        unitText={ car?.odometer.unit.short }
                    />
                </Input.Group>
            ),
            editToastMessages: CarEditNameToast
        },
        [RideLogFormFieldsEnum.Note]: {
            render: () => <NoteInput
                control={ control }
                setValue={ setValue }
                fieldName="note"
            />,
            editToastMessages: CarEditNameToast
        }
    }), [control, setValue, car, formStartOdometerValue, formStartTime]);

    const multiStepFormSteps: Steps = [
        {
            title: t("rides.steps.car_and_start"),
            fields: ["carId", "startTime", "startOdometerValue"],
            render: () => (
                <Input.Group>
                    { fields[RideLogFormFieldsEnum.Car].render() }
                    { fields[RideLogFormFieldsEnum.StartTime].render() }
                    { fields[RideLogFormFieldsEnum.StartOdometer].render() }
                </Input.Group>
            )
        },
        {
            title: t("rides.route"),
            fields: ["places"],
            render: () => (
                <Input.Group>
                    { fields[RideLogFormFieldsEnum.Places].render() }
                </Input.Group>
            )
        },
        {
            title: t("rides.passengers"),
            fields: ["passengers"],
            render: () => (
                <Input.Group>
                    { fields[RideLogFormFieldsEnum.Passengers].render() }
                </Input.Group>
            )
        },
        {
            title: t("rides.steps.end"),
            fields: ["endTime", "endOdometerValue"],
            render: () => (
                <Input.Group>
                    { fields[RideLogFormFieldsEnum.EndTime].render() }
                    { fields[RideLogFormFieldsEnum.EndOdometer].render() }
                </Input.Group>
            )
        },
        {
            title: t("rides.expenses"),
            fields: ["expenses"],
            render: () => (
                <Input.Group>
                    { fields[RideLogFormFieldsEnum.Expenses].render() }
                </Input.Group>
            )
        },
        {
            title: t("common.note"),
            fields: ["note"],
            render: () => <>{ fields[RideLogFormFieldsEnum.Note].render() }</>
        }
    ];

    return { fields, multiStepFormSteps };
}