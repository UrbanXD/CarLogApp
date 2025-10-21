import { UseFormReturn, useWatch } from "react-hook-form";
import useCars from "../../../hooks/useCars.ts";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Car } from "../../../schemas/carSchema.ts";
import { FormFields, Steps } from "../../../../../types/index.ts";
import { CarPickerInput } from "../../../components/forms/inputFields/CarPickerInput.tsx";
import { CarEditNameToast } from "../../../presets/toast/index.ts";
import { AmountInput } from "../../../../_shared/currency/components/AmountInput.tsx";
import Input from "../../../../../components/Input/Input.ts";
import InputDatePicker from "../../../../../components/Input/datePicker/InputDatePicker.tsx";
import { NoteInput } from "../../../../../components/Input/_presets/NoteInput.tsx";
import { FuelLogFormFieldsEnum } from "../enums/fuelLogFormFields.tsx";
import { FuelLogFields } from "../schemas/form/fuelLogForm.ts";
import { OdometerValueInput } from "../../odometer/components/forms/inputFields/OdometerValueInput.tsx";
import { FuelInput } from "../components/forms/inputFields/FuelInput.tsx";
import { Text } from "react-native";

type UseFuelLogFormFieldsProps = UseFormReturn<FuelLogFields>

export function useFuelLogFormFields(props: UseFuelLogFormFieldsProps) {
    const { control, setValue, clearErrors } = props;
    const { getCar } = useCars();

    const [car, setCar] = useState<Car | null>(null);

    const formCarId = useWatch({ control, name: "carId" });
    const formQuantity = useWatch({ control, name: "quantity" });

    useEffect(() => {
        const car = getCar(formCarId);
        setCar(car ?? null);
        setValue("ownerId", car?.ownerId);
        setValue("fuelUnitId", car?.fuelTank.unit.id);
        clearErrors();
    }, [formCarId]);

    const amountFieldExchangeText = useCallback((exchangedAmount: string, isTotalAmount?: boolean) => {
        return (
            <>
                Az autó alapvalutájában számolt { isTotalAmount ? "összeg " : "egységár " }
                <Text style={ { fontWeight: "bold" } }>{ exchangedAmount }</Text>
            </>
        );
    }, []);

    const amountFieldTotalAmountText = useCallback((
        amount: number,
        exchangedAmount: number,
        defaultCurrencyText: string,
        currencyText: string
    ) => {
        let quantity = 0;
        if(!isNaN(Number(formQuantity))) quantity = Number(formQuantity);

        return (
            <>
                Az egyésgár szerinti összköltség{ " " }
                <Text style={ { fontWeight: "bold" } }>
                    { amount * quantity } { currencyText }
                </Text>
                {
                    currencyText !== defaultCurrencyText &&
                   <>
                      , az autó alapvalutájában számítva{ " " }
                      <Text style={ { fontWeight: "bold" } }>
                          { exchangedAmount * quantity }{ "\u00A0" }{ defaultCurrencyText } {/* ${ "\u00A0" } for prevent currency wrap to the next line without amount */ }
                      </Text>
                   </>
                }
            </>
        );
    }, [formQuantity]);

    const fields: Record<FuelLogFormFieldsEnum, FormFields> = useMemo(() => ({
        [FuelLogFormFieldsEnum.Car]: {
            render: () => <CarPickerInput control={ control } fieldName="carId"/>,
            editToastMessages: CarEditNameToast
        },
        [FuelLogFormFieldsEnum.Quantity]: {
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
        [FuelLogFormFieldsEnum.Amount]: {
            render: () => <AmountInput
                control={ control }
                setValue={ setValue }
                amountFieldName="amount"
                currencyFieldName="currencyId"
                isPricePerUnitFieldName="isPricePerUnit"
                exchangeRateFieldName="exchangeRate"
                exchangeText={ amountFieldExchangeText }
                totalAmountText={ amountFieldTotalAmountText }
                defaultCurrency={ car?.currency.id }
            />,
            editToastMessages: CarEditNameToast
        },
        [FuelLogFormFieldsEnum.Date]: {
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
        [FuelLogFormFieldsEnum.OdometerValue]: {
            render: () => <OdometerValueInput
                control={ control }
                fieldName="odometerValue"
                currentOdometerValue={ car?.odometer.value }
                unitText={ car?.odometer.unit.short }
                optional
            />,
            editToastMessages: CarEditNameToast
        },
        [FuelLogFormFieldsEnum.Note]: {
            render: () => <NoteInput
                control={ control }
                setValue={ setValue }
                fieldName="note"
            />,
            editToastMessages: CarEditNameToast
        }
    }), [control, setValue, car, amountFieldTotalAmountText, amountFieldExchangeText]);

    const multiStepFormSteps: Steps = [
        {
            title: "Alap információk",
            fields: ["carId", "date", "odometerValue", "note"],
            render: () => (
                <Input.Group>
                    { fields[FuelLogFormFieldsEnum.Car].render() }
                    { fields[FuelLogFormFieldsEnum.Date].render() }
                    { fields[FuelLogFormFieldsEnum.OdometerValue].render() }
                    { fields[FuelLogFormFieldsEnum.Note].render() }
                </Input.Group>
            )
        },
        {
            title: "Tankolás infók",
            fields: ["quantity", "amount", "exchangeRate", "currencyId"],
            render: () => (
                <Input.Group>
                    { fields[FuelLogFormFieldsEnum.Quantity].render() }
                    { fields[FuelLogFormFieldsEnum.Amount].render() }
                </Input.Group>
            )
        }
    ];

    return { fields, multiStepFormSteps };
}