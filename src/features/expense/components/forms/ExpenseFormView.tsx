import { SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { CarPickerInput } from "../../../car/components/forms/inputFields/CarPickerInput.tsx";
import { ExpenseTypeInput } from "./inputFields/ExpenseTypeInput.tsx";
import { AmountInput } from "../../../_shared/currency/components/AmountInput.tsx";
import Input from "../../../../components/Input/Input.ts";
import InputDatePicker from "../../../../components/Input/datePicker/InputDatePicker.tsx";
import { NoteInput } from "../../../../components/Input/_presets/NoteInput.tsx";
import Form from "../../../../components/Form/Form.tsx";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ExpenseFields } from "../../schemas/form/expenseForm.ts";
import { Car } from "../../../car/schemas/carSchema.ts";

type ExpenseFormViewProps = UseFormReturn<ExpenseFields> & { car: Car | null };

export function ExpenseFormView({ control, resetField, car }: ExpenseFormViewProps) {
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
                amountFieldName="amount"
                currencyFieldName="currencyId"
                exchangeRateFieldName="exchangeRate"
                exchangeText={ (exchangedAmount) => `Az autó alapvalutájában számolt összeg: ${ exchangedAmount }` }
                resetExchangeRate={ () => resetField("exchangeRate") }
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
                resetField={ resetField }
                fieldName="note"
            />
        </Form>
    );
}