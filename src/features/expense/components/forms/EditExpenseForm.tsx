import React, { useMemo } from "react";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useForm } from "react-hook-form";
import { Expense } from "../../schemas/expenseSchema.ts";
import { EditFormButtons } from "../../../../components/Button/presets/EditFormButtons.tsx";
import { ExpenseFields, useEditExpenseFormProps } from "../../schemas/form/expenseForm.ts";
import { EditExpenseFormFields } from "../../enums/editExpenseFormFields.ts";
import { useEditExpenseFields } from "../../hooks/useEditExpenseFields.tsx";
import Form from "../../../../components/Form/Form.tsx";

type EditExpenseFormProps = {
    expense: Expense
    /** Which field will be edited, if its undefined that means full form view will appear */
    field?: EditExpenseFormFields
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

    const editFields = useEditExpenseFields({ ...form, field });

    const submitHandler = useMemo(() => handleSubmit(
        async (formResult: ExpenseFields) => {
            try {
                await expenseDao.update(formResult);
                openToast(editFields.toastMessages.success());

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                console.error("Hiba a submitHandler-ben:", e);
            }
        },
        (errors) => {
            console.log("Edit car validation errors", errors);
        }
    ), [handleSubmit, editFields]);

    return (
        <Form>
            { editFields.render() }
            <EditFormButtons reset={ reset } submit={ submitHandler }/>
        </Form>
    );
};