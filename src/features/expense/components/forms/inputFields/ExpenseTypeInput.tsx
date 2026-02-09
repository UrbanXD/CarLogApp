import { Control } from "react-hook-form";
import Input from "../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants";
import React, { useMemo } from "react";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { useTranslation } from "react-i18next";

type ExpenseTypeInputProps = {
    control: Control<any>
    fieldName: string
    title?: string
    subtitle?: string
}

export function ExpenseTypeInput({
    control,
    fieldName,
    title,
    subtitle
}: ExpenseTypeInputProps) {
    const { t } = useTranslation();
    const { expenseTypeDao } = useDatabase();

    const queryOptions = useMemo(() => {
        return expenseTypeDao.pickerInfiniteQuery((entity) => t(`expenses.types.${ entity.key }`));
    }, [t]);

    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
            fieldNameText={ title ?? t("expenses.types.title") }
            fieldInfoText={ subtitle }
        >
            <Input.Picker.Dropdown<typeof queryOptions["baseQuery"]>
                title={ title ?? t("expenses.types.title") }
                queryOptions={ queryOptions }
                searchBy="key"
                icon={ ICON_NAMES.nametag }
            />
        </Input.Field>
    );
}