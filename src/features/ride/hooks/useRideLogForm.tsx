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

type UseRideLogFormFieldsProps = UseFormReturn<RideLogFormFields>

export function useRideLogFormFields(props: UseRideLogFormFieldsProps) {
    const { control, setValue, clearErrors } = props;
    const { getCar } = useCars();

    const [car, setCar] = useState<Car | null>(null);

    const formCarId = useWatch({ control, name: "carId" });

    useEffect(() => {
        const car = getCar(formCarId);
        setCar(car ?? null);
        clearErrors();
    }, [formCarId]);

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
                title={ "Induló kilométeróra-állás" }
                currentOdometerValue={ car?.odometer.value }
                unitText={ car?.odometer.unit.short }
                optional
            />,
            editToastMessages: CarEditNameToast
        },
        [RideLogFormFieldsEnum.EndOdometer]: {
            render: () => <OdometerValueInput
                control={ control }
                fieldName="endOdometerValue"
                title={ "Záró kilométeróra-állás" }
                currentOdometerValue={ car?.odometer.value }
                unitText={ car?.odometer.unit.short }
                optional
            />,
            editToastMessages: CarEditNameToast
        },
        [RideLogFormFieldsEnum.StartTime]: {
            render: () => (
                <Input.Field
                    control={ control }
                    fieldName="startTime"
                    fieldNameText="Indulás"
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
                    fieldNameText="Érkezés"
                >
                    <InputDatePicker/>
                </Input.Field>
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
    }), [control, setValue, car]);

    const multiStepFormSteps: Steps = [
        {
            title: "Autó és indulás",
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
            title: "Útvonal",
            fields: ["places"],
            render: () => (
                <Input.Group>
                    { fields[RideLogFormFieldsEnum.Places].render() }
                </Input.Group>
            )
        },
        {
            title: "Utas lista",
            fields: ["passengers"],
            render: () => (
                <Input.Group>
                    { fields[RideLogFormFieldsEnum.Passengers].render() }
                </Input.Group>
            )
        },
        {
            title: "Érkezés",
            fields: ["endTime", "endOdometerValue"],
            render: () => (
                <Input.Group>
                    { fields[RideLogFormFieldsEnum.EndTime].render() }
                    { fields[RideLogFormFieldsEnum.EndOdometer].render() }
                </Input.Group>
            )
        },
        {
            title: "Kiadási lista",
            fields: ["expenses"],
            render: () => (
                <Input.Group>
                    { fields[RideLogFormFieldsEnum.Expenses].render() }
                </Input.Group>
            )
        },
        {
            title: "Megjegyzés",
            fields: ["note"],
            render: () => <>{ fields[RideLogFormFieldsEnum.Note].render() }</>
        }
    ];

    return { fields, multiStepFormSteps };
}