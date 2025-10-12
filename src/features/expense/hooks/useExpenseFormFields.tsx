import { UseFormReturn, useWatch } from "react-hook-form";
import { Car } from "../../car/schemas/carSchema.ts";
import { ExpenseFormFields } from "../enums/expenseFormFields.ts";
import { ExpenseFields } from "../schemas/form/expenseForm.ts";
import { FormFields } from "../../../types/index.ts";
import { CarPickerInput } from "../../car/components/forms/inputFields/CarPickerInput.tsx";
import { CarEditNameToast } from "../../car/presets/toast/index.ts";
import { ExpenseTypeInput } from "../components/forms/inputFields/ExpenseTypeInput.tsx";
import { AmountInput } from "../../_shared/currency/components/AmountInput.tsx";
import React, { useEffect, useMemo, useState } from "react";
import InputDatePicker from "../../../components/Input/datePicker/InputDatePicker.tsx";
import Input from "../../../components/Input/Input.ts";
import { NoteInput } from "../../../components/Input/_presets/NoteInput.tsx";
import useCars from "../../car/hooks/useCars.ts";

type UseExpenseFormFieldsProps = UseFormReturn<ExpenseFields>

export function useExpenseFormFields(props: UseExpenseFormFieldsProps) {
    const { control, setValue, clearErrors } = props;
    const { getCar } = useCars();

    const [car, setCar] = useState<Car | null>(null);

    const formCarId = useWatch({ control, name: "carId" });

    useEffect(() => {
        const car = getCar(formCarId);
        setCar(car ?? null);
        clearErrors();
    }, [formCarId]);

    const fields: Record<ExpenseFormFields, FormFields> = useMemo(() => ({
        [ExpenseFormFields.Car]: {
            render: () => <CarPickerInput control={ control } fieldName="carId"/>,
            editToastMessages: CarEditNameToast
        },
        [ExpenseFormFields.Type]: {
            render: () => <ExpenseTypeInput control={ control } fieldName="typeId"/>,
            editToastMessages: CarEditNameToast
        },
        [ExpenseFormFields.Amount]: {
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
        [ExpenseFormFields.Date]: {
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
        [ExpenseFormFields.Note]: {
            render: () => <NoteInput
                control={ control }
                setValue={ setValue }
                fieldName="note"
            />,
            editToastMessages: CarEditNameToast
        }
    }), [control, setValue, car]);

    const fullForm: FormFields = {
        render: () => ([
            <React.Fragment key="car">{ fields[ExpenseFormFields.Car].render() }</React.Fragment>,
            <React.Fragment key="type">{ fields[ExpenseFormFields.Type].render() }</React.Fragment>,
            <React.Fragment key="amount">{ fields[ExpenseFormFields.Amount].render() }</React.Fragment>,
            <React.Fragment key="date">{ fields[ExpenseFormFields.Date].render() }</React.Fragment>,
            <React.Fragment key="note">{ fields[ExpenseFormFields.Note].render() }</React.Fragment>
        ]),
        editToastMessages: CarEditNameToast
    };

    return { fields, fullForm };
}
