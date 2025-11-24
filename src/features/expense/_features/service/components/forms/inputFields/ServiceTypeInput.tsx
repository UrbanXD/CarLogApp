import { Control } from "react-hook-form";
import { useDatabase } from "../../../../../../../contexts/database/DatabaseContext.ts";
import React, { useMemo } from "react";
import Input from "../../../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../../../constants/index.ts";
import { useTranslation } from "react-i18next";

type FuelTypeInputProps = {
    control: Control<any>
    fieldName: string
    title?: string
    subtitle?: string
}

export function ServiceTypeInput({
    control,
    fieldName,
    title,
    subtitle
}: FuelTypeInputProps) {
    const { t } = useTranslation();
    const { serviceTypeDao } = useDatabase();

    const paginator = useMemo(() => serviceTypeDao.paginator({
        getTitle: (entity) => t(`service.types.${ entity.key }`)
    }), [t]);

    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
            fieldNameText={ title ?? t("service.types.title") }
            fieldInfoText={ subtitle }
        >
            <Input.Picker.Dropdown
                title={ title ?? t("service.types.title") }
                paginator={ paginator }
                searchBy="key"
                icon={ ICON_NAMES.serviceOutline }
            />
        </Input.Field>
    );
}