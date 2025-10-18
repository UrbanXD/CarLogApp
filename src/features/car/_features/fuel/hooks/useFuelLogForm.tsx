import { UseFormReturn, useWatch } from "react-hook-form";
import useCars from "../../../hooks/useCars.ts";
import React, { useEffect, useMemo, useState } from "react";
import { Car } from "../../../schemas/carSchema.ts";
import { FormFields, Steps } from "../../../../../types/index.ts";
import { CarPickerInput } from "../../../components/forms/inputFields/CarPickerInput.tsx";
import { CarEditNameToast } from "../../../presets/toast/index.ts";
import { AmountInput } from "../../../../_shared/currency/components/AmountInput.tsx";
import Input from "../../../../../components/Input/Input.ts";
import InputDatePicker from "../../../../../components/Input/datePicker/InputDatePicker.tsx";
import { NoteInput } from "../../../../../components/Input/_presets/NoteInput.tsx";
import { FuelLogFormFields } from "../enums/fuelLogFormFields.tsx";
import { FuelLogFields } from "../schemas/form/fuelLogForm.ts";
import { OdometerValueInput } from "../../odometer/components/forms/inputFields/OdometerValueInput.tsx";
import { FuelInput } from "../components/forms/inputFields/FuelInput.tsx";

type UseFuelLogFormFieldsProps = UseFormReturn<FuelLogFields>

export function useFuelLogFormFields(props: UseFuelLogFormFieldsProps) {
    const { control, setValue, clearErrors } = props;
    const { getCar } = useCars();

    const [car, setCar] = useState<Car | null>(null);

    const formCarId = useWatch({ control, name: "carId" });

    useEffect(() => {
        const car = getCar(formCarId);
        setCar(car ?? null);
        setValue("ownerId", car?.ownerId);
        setValue("fuelUnitId", car?.fuelTank.unit.id);
        setValue("currencyId", car?.currency.id);
        clearErrors();
    }, [formCarId]);

    const fields: Record<FuelLogFormFields, FormFields> = useMemo(() => ({
        [FuelLogFormFields.Car]: {
            render: () => <CarPickerInput control={ control } fieldName="carId"/>,
            editToastMessages: CarEditNameToast
        },
        [FuelLogFormFields.Quantity]: {
            render: () => <FuelInput
                control={ control }
                setValue={ setValue }
                fieldName="quantity"
                capacity={ car?.fuelTank.capacity }
                fuelTypeText={ car?.fuelTank.type.key }
                unitText={ car?.fuelTank.unit.short }
            />,
            editToastMessages: CarEditNameToast
        },
        [FuelLogFormFields.Amount]: {
            render: () => <AmountInput
                control={ control }
                setValue={ setValue }
                amountFieldName="amount"
                currencyFieldName="currencyId"
                exchangeRateFieldName="exchangeRate"
                exchangeText={ (exchangedAmount) => `Az autó alapvalutájában számolt összeg: ${ exchangedAmount }` }
                defaultCurrency={ car?.currency.id }
            />,
            editToastMessages: CarEditNameToast
        },
        [FuelLogFormFields.Date]: {
            render: () => (
                <Input.Field
                    control={ control }
                    fieldName="date"
                    fieldNameText="Dátum"
                >
                    <InputDatePicker/>
                </Input.Field>
            ),
            editToastMessages: CarEditNameToast
        },
        [FuelLogFormFields.OdometerValue]: {
            render: () => <OdometerValueInput
                control={ control }
                fieldName="odometerValue"
                currentOdometerValue={ car?.odometer.value }
                unitText={ car?.odometer.unit.short }
                optional
            />,
            editToastMessages: CarEditNameToast
        },
        [FuelLogFormFields.Note]: {
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
            title: "Alap információk",
            fields: ["carId", "date", "odometerValue", "note"],
            render: () => (
                <Input.Group>
                    { fields[FuelLogFormFields.Car].render() }
                    { fields[FuelLogFormFields.Date].render() }
                    { fields[FuelLogFormFields.OdometerValue].render() }
                    { fields[FuelLogFormFields.Note].render() }
                </Input.Group>
            )
        },
        {
            title: "Tankolás infóók",
            fields: ["quantity", "amount", "exchangeRate", "currencyId"],
            render: () => (
                <Input.Group>
                    { fields[FuelLogFormFields.Quantity].render() }
                    { fields[FuelLogFormFields.Amount].render() }
                </Input.Group>
            )
        }
    ];

    return { fields, multiStepFormSteps };
}