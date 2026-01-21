import Input from "../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants";
import { MoreDataLoading } from "../../../../../components/loading/MoreDataLoading.tsx";
import React from "react";
import { Control, FieldPathByValue, FieldValues } from "react-hook-form";
import { PickerItemType } from "../../../../../components/Input/picker/PickerItem.tsx";
import useCars from "../../../hooks/useCars.ts";
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
    const { cars, isLoading } = useCars<PickerItemType>({ extraMapper: carDao.mapper.dtoToPicker });

    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
            fieldNameText={ title ?? t("car.picker.title") }
            fieldInfoText={ subtitle }
        >
            {
                cars && !isLoading
                ?
                <Input.Picker.Dropdown
                    title={ title ?? t("car.picker.title") }
                    data={ cars }
                    icon={ ICON_NAMES.car }
                />
                :
                <MoreDataLoading/>
            }
        </Input.Field>
    );
}