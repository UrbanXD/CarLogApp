import Input from "../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants";
import React, { useMemo } from "react";
import { Control, FieldPathByValue, FieldValues } from "react-hook-form";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { useTranslation } from "react-i18next";

type CarPickerInputProps<FormFieldValues extends FieldValues> = {
    control: Control<FormFieldValues>
    fieldName: FieldPathByValue<FormFieldValues, string>
    title?: string
    subtitle?: string
}

export function CarPickerInput<FormFieldValues extends FieldValues>({
    control,
    fieldName,
    title,
    subtitle
}: CarPickerInputProps<FormFieldValues>) {
    const { t } = useTranslation();
    const { carDao } = useDatabase();

    const queryOptions = useMemo(() => {
        return carDao.pickerInfiniteQuery();
    }, [carDao]);

    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
            fieldNameText={ title ?? t("car.picker.title") }
            fieldInfoText={ subtitle }
        >
            <Input.Picker.Dropdown<typeof queryOptions["baseQuery"]>
                title={ title ?? t("service.types.title") }
                queryOptions={ queryOptions }
                searchBy="car.name"
                icon={ ICON_NAMES.car }
            />
        </Input.Field>
    );
}