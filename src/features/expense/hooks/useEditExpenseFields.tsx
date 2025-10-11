import { UseFormReturn, useWatch } from "react-hook-form";
import { Car } from "../../car/schemas/carSchema.ts";
import { EditExpenseFormFields } from "../enums/editExpenseFormFields.ts";
import { ExpenseFields } from "../schemas/form/expenseForm.ts";
import { EditFields } from "../../../types/index.ts";
import { CarPickerInput } from "../../car/components/forms/inputFields/CarPickerInput.tsx";
import { CarEditNameToast } from "../../car/presets/toast/index.ts";
import { ExpenseTypeInput } from "../components/forms/inputFields/ExpenseTypeInput.tsx";
import { AmountInput } from "../../_shared/currency/components/AmountInput.tsx";
import React, { useEffect, useState } from "react";
import InputDatePicker from "../../../components/Input/datePicker/InputDatePicker.tsx";
import Input from "../../../components/Input/Input.ts";
import { NoteInput } from "../../../components/Input/_presets/NoteInput.tsx";
import { ExpenseFormView } from "../components/forms/ExpenseFormView.tsx";
import useCars from "../../car/hooks/useCars.ts";

type UseEditExpenseFieldsArgs = UseFormReturn<ExpenseFields> & {
    field?: EditExpenseFormFields
}

export function useEditExpenseFields({ field, ...restProps }: UseEditExpenseFieldsArgs) {
    const { control, setValue } = restProps;
    const { getCar } = useCars();

    const [car, setCar] = useState<Car | null>(null);

    const formCarId = useWatch({ control, name: "carId" });

    useEffect(() => {
        const car = getCar(formCarId);
        setCar(car ?? null);
    }, [formCarId]);

    const fields: Record<EditExpenseFormFields & "full", EditFields> = {
        [EditExpenseFormFields.Car]: {
            render: () => <CarPickerInput control={ control } fieldName="carId"/>,
            toastMessages: CarEditNameToast
        },
        [EditExpenseFormFields.Type]: {
            render: () => <ExpenseTypeInput control={ control } fieldName="typeId"/>,
            toastMessages: CarEditNameToast
        },
        [EditExpenseFormFields.Amount]: {
            render: () => <AmountInput
                control={ control }
                amountFieldName="amount"
                currencyFieldName="currencyId"
                exchangeRateFieldName="exchangeRate"
                exchangeText={ (exchangedAmount) => `Az autó alapvalutájában számolt összeg: ${ exchangedAmount }` }
                resetExchangeRate={ () => resetField("exchangeRate") }
                defaultCurrency={ car?.currency.id }
            />,
            toastMessages: CarEditNameToast
        },
        [EditExpenseFormFields.Date]: {
            render: () => (
                <Input.Field
                    control={ control }
                    fieldName="date"
                    fieldNameText="Dátum"
                >
                    <InputDatePicker/>
                </Input.Field>
            ),
            toastMessages: CarEditNameToast
        },
        [EditExpenseFormFields.Note]: {
            render: () => <NoteInput
                control={ control }
                setValue={ setValue }
                fieldName="note"
            />,
            toastMessages: CarEditNameToast
        },
        full: {
            render: () => <ExpenseFormView { ...restProps } />,
            toastMessages: CarEditNameToast
        }
    };

    return fields?.[field] ?? fields["full"];
}
