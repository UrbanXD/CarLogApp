import useCars from "../../../car/hooks/useCars.ts";
import React from "react";
import { useForm } from "react-hook-form";
import { ExpenseFields, useCreateExpenseFormProps } from "../../schemas/form/expenseForm.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { CarCreateToast } from "../../../car/presets/toast/index.ts";
import { useExpenseFormFields } from "../../hooks/useExpenseFormFields.tsx";
import Form from "../../../../components/Form/Form.tsx";
import { FormButtons } from "../../../../components/Button/presets/FormButtons.tsx";

export function CreateExpenseForm() {
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();
    const { expenseDao } = useDatabase();
    const { selectedCar } = useCars();

    const form = useForm<ExpenseFields>(useCreateExpenseFormProps(selectedCar));
    const { handleSubmit } = form;

    const { fullForm } = useExpenseFormFields(form);

    const submitHandler = handleSubmit(
        async (formResult: ExpenseFields) => {
            try {
                await expenseDao.create(formResult, true);

                openToast(CarCreateToast.success());

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(CarCreateToast.error());
                console.error("Hiba a submitHandler-ben log:", e);
            }
        },
        (errors) => {
            console.log("Create expense validation errors", errors);
            openToast(CarCreateToast.error());
        }
    );

    return (
        <Form>
            { fullForm.render() }
            <FormButtons submit={ submitHandler } submitText={ "Rögzítés" }/>
        </Form>
    );
}