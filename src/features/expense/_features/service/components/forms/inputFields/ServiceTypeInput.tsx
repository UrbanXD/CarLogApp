import { Control } from "react-hook-form";
import { useDatabase } from "../../../../../../../contexts/database/DatabaseContext.ts";
import React, { useMemo } from "react";
import Input from "../../../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../../../constants/index.ts";

type FuelTypeInputProps = {
    control: Control<any>
    fieldName: string
    title?: string
    subtitle?: string
}

export function ServiceTypeInput({
    control,
    fieldName,
    title = "Szervíz típus",
    subtitle
}: FuelTypeInputProps) {
    const { serviceTypeDao } = useDatabase();
    const paginator = useMemo(() => serviceTypeDao.paginator(50), []);

    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
            fieldNameText={ title }
            fieldInfoText={ subtitle }
        >
            <Input.Picker.Dropdown
                title={ title }
                paginator={ paginator }
                searchBy="key"
                icon={ ICON_NAMES.serviceOutline }
            />
        </Input.Field>
    );
}