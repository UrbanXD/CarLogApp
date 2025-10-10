import { Control } from "react-hook-form";
import Input from "../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { MoreDataLoading } from "../../../../../components/loading/MoreDataLoading.tsx";
import React, { useEffect, useState } from "react";
import { PickerItemType } from "../../../../../components/Input/picker/PickerItem.tsx";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";

type ExpenseTypeInputProps = {
    control: Control<any>
    fieldName: string
    title?: string
    subtitle?: string
}

export function ExpenseTypeInput({
    control,
    fieldName,
    title = "Kiadás típusa",
    subtitle
}: ExpenseTypeInputProps) {
    const { expenseTypeDao } = useDatabase();
    const [expenseTypes, setExpenseTypes] = useState<Array<PickerItemType> | null>(null);

    useEffect(() => {
        (async () => {
            const expenseTypesDto = await expenseTypeDao.getAll();
            setExpenseTypes(expenseTypeDao.mapper.dtoToPicker(expenseTypesDto));
        })();
    }, []);

    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
            fieldNameText={ title }
            fieldInfoText={ subtitle }
        >
            {
                expenseTypes
                ?
                <Input.Picker.Dropdown
                    title={ title }
                    icon={ ICON_NAMES.nametag }
                    data={ expenseTypes }
                />
                :
                <MoreDataLoading/>
            }
        </Input.Field>
    );
}