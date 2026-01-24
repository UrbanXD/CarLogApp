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

export function ServiceItemTypeInput({
    control,
    fieldName,
    title,
    subtitle
}: FuelTypeInputProps) {
    const { t } = useTranslation();
    const { serviceItemTypeDao } = useDatabase();

    const queryOptions = useMemo(() => {
        return serviceItemTypeDao.pickerInfiniteQuery((entity) => t(`service.items.types.${ entity.key }`));
    }, [t]);

    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
            fieldNameText={ title ?? t("service.items.types.title") }
            fieldInfoText={ subtitle }
        >
            <Input.Picker.Dropdown<typeof queryOptions["baseQuery"]>
                title={ title ?? t("service.items.types.title") }
                queryOptions={ queryOptions }
                searchBy="key"
                icon={ ICON_NAMES.serviceOutline }
            />
        </Input.Field>
    );
}