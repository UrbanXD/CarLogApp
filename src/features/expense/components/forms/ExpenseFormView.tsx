import { SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { CarPickerInput } from "../../../car/components/forms/inputFields/CarPickerInput.tsx";
import { ExpenseTypeInput } from "./inputFields/ExpenseTypeInput.tsx";
import { AmountInput } from "../../../_shared/currency/components/AmountInput.tsx";
import Input from "../../../../components/Input/Input.ts";
import InputDatePicker from "../../../../components/Input/datePicker/InputDatePicker.tsx";
import { NoteInput } from "../../../../components/Input/_presets/NoteInput.tsx";
import Form from "../../../../components/Form/Form.tsx";
import React, { useEffect, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { ExpenseFields } from "../../schemas/form/expenseForm.ts";
import { Car } from "../../../car/schemas/carSchema.ts";
import useCars from "../../../car/hooks/useCars.ts";

type ExpenseFormViewProps = UseFormReturn<ExpenseFields>;

export function ExpenseFormView({ control, setValue, clearErrors }: ExpenseFormViewProps) {
    const { getCar } = useCars();

    const [car, setCar] = useState<Car | null>(null);

    const formCarId = useWatch({ control, name: "carId" });

    useEffect(() => {
        const car = getCar(formCarId);
        setCar(car ?? null);
        clearErrors();
    }, [formCarId]);

    return (
        <Form containerStyle={ { paddingBottom: SEPARATOR_SIZES.small } }>
            <CarPickerInput
                control={ control }
                fieldName="carId"
            />
            <ExpenseTypeInput
                control={ control }
                fieldName="typeId"
            />
            <AmountInput
                control={ control }
                setValue={ setValue }
                amountFieldName="amount"
                currencyFieldName="currencyId"
                exchangeRateFieldName="exchangeRate"
                exchangeText={ (exchangedAmount) => `Az autó alapvalutájában számolt összeg: ${ exchangedAmount }` }
                defaultCurrency={ car?.currency.id }
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
    );
}