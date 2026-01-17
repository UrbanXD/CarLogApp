import { UseFormReturn, useWatch } from "react-hook-form";
import { Car } from "../../car/schemas/carSchema.ts";
import { ExpenseFormFieldsEnum } from "../enums/expenseFormFieldsEnum.ts";
import { FormFields } from "../../../types/index.ts";
import { CarPickerInput } from "../../car/components/forms/inputFields/CarPickerInput.tsx";
import { ExpenseTypeInput } from "../components/forms/inputFields/ExpenseTypeInput.tsx";
import { AmountInput } from "../../_shared/currency/components/AmountInput.tsx";
import React, { useEffect, useMemo, useState } from "react";
import InputDatePicker from "../../../components/Input/datePicker/InputDatePicker.tsx";
import Input from "../../../components/Input/Input.ts";
import { NoteInput } from "../../../components/Input/_presets/NoteInput.tsx";
import useCars from "../../car/hooks/useCars.ts";
import { EditToast } from "../../../ui/alert/presets/toast/index.ts";
import { useTranslation } from "react-i18next";
import { ExpenseFormFields } from "../schemas/form/expenseForm.ts";

type UseExpenseFormFieldsProps = UseFormReturn<ExpenseFormFields, any, ExpenseFormFields>

export function useExpenseFormFields(props: UseExpenseFormFieldsProps) {
    const { control, setValue, clearErrors } = props;
    const { t } = useTranslation();
    const { getCar } = useCars();

    const [car, setCar] = useState<Car | null>(null);

    const formCarId = useWatch({ control, name: "carId" });

    useEffect(() => {
        const car = getCar(formCarId);
        setCar(car ?? null);
        clearErrors();
    }, [formCarId]);

    const fields: Record<ExpenseFormFieldsEnum, FormFields> = useMemo(() => ({
        [ExpenseFormFieldsEnum.Car]: {
            render: () => <CarPickerInput control={ control } fieldName="carId"/>,
            editToastMessages: EditToast
        },
        [ExpenseFormFieldsEnum.Type]: {
            render: () => <ExpenseTypeInput control={ control } fieldName="typeId"/>,
            editToastMessages: EditToast
        },
        [ExpenseFormFieldsEnum.Amount]: {
            render: () => <AmountInput
                control={ control }
                setValue={ setValue }
                fieldName="expense"
                defaultCurrency={ car?.currency.id }
            />,
            editToastMessages: EditToast
        },
        [ExpenseFormFieldsEnum.Date]: {
            render: () => (
                <Input.Field
                    control={ control }
                    fieldName="date"
                    fieldNameText={ t("date.text") }
                >
                    <InputDatePicker/>
                </Input.Field>
            ),
            editToastMessages: EditToast
        },
        [ExpenseFormFieldsEnum.Note]: {
            render: () => <NoteInput
                control={ control }
                setValue={ setValue }
                fieldName="note"
            />,
            editToastMessages: EditToast
        }
    }), [control, setValue, car]);

    const fullForm: FormFields = {
        render: () => ([
            <React.Fragment key="car">{ fields[ExpenseFormFieldsEnum.Car].render() }</React.Fragment>,
            <React.Fragment key="type">{ fields[ExpenseFormFieldsEnum.Type].render() }</React.Fragment>,
            <React.Fragment key="amount">{ fields[ExpenseFormFieldsEnum.Amount].render() }</React.Fragment>,
            <React.Fragment key="date">{ fields[ExpenseFormFieldsEnum.Date].render() }</React.Fragment>,
            <React.Fragment key="note">{ fields[ExpenseFormFieldsEnum.Note].render() }</React.Fragment>
        ]),
        editToastMessages: EditToast
    };

    return { fields, fullForm };
}
