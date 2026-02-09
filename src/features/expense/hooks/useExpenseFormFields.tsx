import { UseFormReturn, useWatch } from "react-hook-form";
import { ExpenseFormFieldsEnum } from "../enums/expenseFormFieldsEnum.ts";
import { FormFields } from "../../../types";
import { CarPickerInput } from "../../car/components/forms/inputFields/CarPickerInput.tsx";
import { ExpenseTypeInput } from "../components/forms/inputFields/ExpenseTypeInput.tsx";
import { AmountInput } from "../../_shared/currency/components/AmountInput.tsx";
import React, { useEffect, useMemo } from "react";
import InputDatePicker from "../../../components/Input/datePicker/InputDatePicker.tsx";
import Input from "../../../components/Input/Input.ts";
import { NoteInput } from "../../../components/Input/_presets/NoteInput.tsx";
import { EditToast } from "../../../ui/alert/presets/toast";
import { useTranslation } from "react-i18next";
import { ExpenseFormFields } from "../schemas/form/expenseForm.ts";

type UseExpenseFormFieldsProps = UseFormReturn<ExpenseFormFields, any, ExpenseFormFields>

export function useExpenseFormFields(props: UseExpenseFormFieldsProps) {
    const { control, setValue, clearErrors } = props;
    const { t } = useTranslation();

    const formCarId = useWatch({ control, name: "carId" });

    useEffect(() => {
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
                carIdFieldName="carId"
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
    }), [control, setValue]);

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
