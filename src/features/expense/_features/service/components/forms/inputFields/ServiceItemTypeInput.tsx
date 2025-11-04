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

export function ServiceItemTypeInput({
    control,
    fieldName,
    title = "Tétel típus",
    subtitle
}: FuelTypeInputProps) {
    const { serviceItemTypeDao } = useDatabase();
    const paginator = useMemo(() => serviceItemTypeDao.paginator(), []);

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