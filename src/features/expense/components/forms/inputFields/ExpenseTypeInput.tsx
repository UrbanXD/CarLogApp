import { Control } from "react-hook-form";
import Input from "../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { MoreDataLoading } from "../../../../../components/loading/MoreDataLoading.tsx";
import React, { useEffect, useState } from "react";
import { PickerItemType } from "../../../../../components/Input/picker/PickerItem.tsx";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { useTranslation } from "react-i18next";
import { ExpenseType } from "../../../schemas/expenseTypeSchema.ts";

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

    const [rawExpenseTypes, setRawExpenseTypes] = useState<Array<ExpenseType> | null>(null);
    const [expenseTypes, setExpenseTypes] = useState<Array<PickerItemType>>([]);

    useEffect(() => {
        (async () => {
            setRawExpenseTypes(await expenseTypeDao.getAllOtherExpenseType());
        })();
    }, []);

    useEffect(() => {
        if(!rawExpenseTypes) return;

        setExpenseTypes(
            expenseTypeDao.mapper.dtoToPicker({
                dtos: rawExpenseTypes,
                getTitle: (dto) => t(`expenses.types.${ dto.key }`)
            })
        );

    }, [rawExpenseTypes, t]);

    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
            fieldNameText={ title ?? t("expenses.types.title") }
            fieldInfoText={ subtitle }
        >
            {
                rawExpenseTypes
                ?
                <Input.Picker.Dropdown
                    title={ title ?? t("expenses.types.title") }
                    icon={ ICON_NAMES.nametag }
                    data={ expenseTypes }
                />
                :
                <MoreDataLoading/>
            }
        </Input.Field>
    );
}