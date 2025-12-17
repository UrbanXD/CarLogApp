import React from "react";
import { CreateExpenseForm } from "../../components/forms/CreateExpenseForm.tsx";
import { useTranslation } from "react-i18next";
import { FormBottomSheet } from "../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";

export function CreateExpenseBottomSheet() {
    const { t } = useTranslation();

    return (
        <FormBottomSheet
            title={ t("expenses.create") }
            content={ <CreateExpenseForm/> }
        />
    );
}