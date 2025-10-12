import React, { useMemo } from "react";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useForm } from "react-hook-form";
import { Expense } from "../../schemas/expenseSchema.ts";
import { FormButtons } from "../../../../components/Button/presets/FormButtons.tsx";
import { ExpenseFields, useEditExpenseFormProps } from "../../schemas/form/expenseForm.ts";
import { ExpenseFormFields } from "../../enums/expenseFormFields.ts";
import { useExpenseFormFields } from "../../hooks/useExpenseFormFields.tsx";
import Form from "../../../../components/Form/Form.tsx";
import { FormFields } from "../../../../types/index.ts";

type EditExpenseFormProps = {
    expense: Expense
    /** Which field will be edited, if its undefined that means full form view will appear */
    field?: ExpenseFormFields
}

export function EditExpenseForm({
    expense,
    field
}: EditExpenseFormProps) {
    const { expenseDao } = useDatabase();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();

    const form = useForm<ExpenseFields>(useEditExpenseFormProps(expense));
    const { handleSubmit, reset } = form;

    const { fields, fullForm } = useExpenseFormFields(form);
    const editFields: FormFields = fields?.[field] ?? fullForm;

    const submitHandler = useMemo(() => handleSubmit(
        async (formResult: ExpenseFields) => {
            try {
                await expenseDao.update(formResult);
                openToast(editFields.editToastMessages.success());

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(editFields.editToastMessages.error());
                console.error("Hiba a submitHandler-ben:", e);
            }
        },
        (errors) => {
            openToast(editFields.editToastMessages.error());
            console.log("Edit car validation errors", errors);
        }
    ), [handleSubmit, editFields]);

    return (
        <Form>
            { editFields.render() }
            <FormButtons reset={ reset } submit={ submitHandler }/>
        </Form>
    );
};