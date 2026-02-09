import { useTranslation } from "react-i18next";
import { useLocalSearchParams } from "expo-router";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import React, { useMemo } from "react";
import { useWatchedQueryItem } from "../../../../database/hooks/useWatchedQueryItem.ts";
import { useFormBottomSheetGuard } from "../../../../hooks/useFormBottomSheetGuard.ts";
import { ExpenseFormFieldsEnum } from "../../enums/expenseFormFieldsEnum.ts";
import { EditExpenseForm } from "../../components/forms/EditExpenseForm.tsx";
import { FormBottomSheet } from "../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";

export function EditExpenseBottomSheet() {
    const { t } = useTranslation();
    const { id, field } = useLocalSearchParams<{ id?: string, field?: string }>();
    const { expenseDao } = useDatabase();

    const memoizedQuery = useMemo(() => expenseDao.expenseWatchedQueryItem(id), [expenseDao, id]);
    const { data: expense, isLoading } = useWatchedQueryItem(memoizedQuery);

    const { fieldValue, isValidField } = useFormBottomSheetGuard({
        data: expense,
        isLoading,
        field,
        enumObject: ExpenseFormFieldsEnum,
        notFoundText: t("expenses.title_singular")
    });

    if(!isValidField) return null;

    const CONTENT = expense ? <EditExpenseForm expense={ expense } field={ fieldValue }/> : null;

    return (
        <FormBottomSheet
            content={ CONTENT }
            enableDynamicSizing
        />
    );
}