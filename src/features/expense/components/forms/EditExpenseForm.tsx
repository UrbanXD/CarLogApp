import React from "react";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { FormState, useForm } from "react-hook-form";
import { Expense } from "../../schemas/expenseSchema.ts";
import { ExpenseFormFields, useEditExpenseFormProps } from "../../schemas/form/expenseForm.ts";
import { ExpenseFormFieldsEnum } from "../../enums/expenseFormFieldsEnum.ts";
import { useExpenseFormFields } from "../../hooks/useExpenseFormFields.tsx";
import Form from "../../../../components/Form/Form.tsx";
import { FormFields, SubmitHandlerArgs } from "../../../../types/index.ts";
import { InvalidFormToast } from "../../../../ui/alert/presets/toast/index.ts";

type EditExpenseFormProps = {
    expense: Expense
    /** Which field will be edited, if its undefined that means full form view will appear */
    field?: ExpenseFormFieldsEnum
    onFormStateChange?: (formState: FormState<ExpenseFormFields>) => void
}

export function EditExpenseForm({
    expense,
    field,
    onFormStateChange
}: EditExpenseFormProps) {
    const { expenseDao } = useDatabase();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();

    const form = useForm<ExpenseFormFields, any, ExpenseFormFields>(useEditExpenseFormProps(expense));

    const { fields, fullForm } = useExpenseFormFields(form);
    const editFields: FormFields = field ? fields?.[field] ?? fullForm : fullForm;

    const submitHandler: SubmitHandlerArgs<ExpenseFormFields> = {
        onValid: async (formResult) => {
            try {
                await expenseDao.update(formResult);
                openToast(editFields.editToastMessages.success());

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(editFields.editToastMessages.error());
                console.error("Hiba a submitHandler-ben:", e);
            }
        },
        onInvalid: (errors) => {
            openToast(InvalidFormToast.warning());
            console.log("Edit car validation errors", errors);
        }
    };

    return (
        <Form
            edit
            form={ form }
            formFields={ editFields.render() }
            submitHandler={ submitHandler }
            onFormStateChange={ onFormStateChange }
        />
    );
}