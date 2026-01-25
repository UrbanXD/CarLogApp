import React from "react";
import { FormState, useForm } from "react-hook-form";
import { ExpenseFormFields, useCreateExpenseFormProps } from "../../schemas/form/expenseForm.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useExpenseFormFields } from "../../hooks/useExpenseFormFields.tsx";
import Form from "../../../../components/Form/Form.tsx";
import { CreateToast, InvalidFormToast } from "../../../../ui/alert/presets/toast";
import { useTranslation } from "react-i18next";
import { SubmitHandlerArgs } from "../../../../types";
import { useCar } from "../../../car/hooks/useCar.ts";
import { useAppSelector } from "../../../../hooks";
import { getSelectedCarId } from "../../../car/model/selectors/getSelectedCarId.ts";

type CreateExpenseFormProps = {
    onFormStateChange?: (formState: FormState<ExpenseFormFields>) => void
}

export function CreateExpenseForm({ onFormStateChange }: CreateExpenseFormProps) {
    const { t } = useTranslation();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();
    const { expenseDao } = useDatabase();
    const selectedCarId = useAppSelector(getSelectedCarId);
    const { car } = useCar({ carId: selectedCarId, options: { queryOnce: true } });

    const form = useForm<ExpenseFormFields, any, ExpenseFormFields>(useCreateExpenseFormProps(car));
    const { fullForm } = useExpenseFormFields(form);

    const submitHandler: SubmitHandlerArgs<ExpenseFormFields> = {
        onValid: async (formResult) => {
            try {
                await expenseDao.createFromFormResult(formResult);

                openToast(CreateToast.success(t("expenses.title_singular")));
                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(CreateToast.error(t("fuel.title_singular")));
                console.error("Hiba a submitHandler-ben log:", e);
            }
        },
        onInvalid: (errors) => {
            console.log("Create expense validation errors", errors);
            openToast(InvalidFormToast.warning());
        }
    };

    return (
        <Form
            form={ form }
            formFields={ fullForm.render() }
            submitHandler={ submitHandler }
            submitText={ t("form_button.record") }
            onFormStateChange={ onFormStateChange }
        />
    );
}