import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import React, { useMemo } from "react";
import Input from "../../../../components/Input/Input.ts";
import { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CurrencyTableRow } from "../../../../database/connector/powersync/AppSchema.ts";

type CurrencyInputProps = {
    control: Control<any>
    fieldName: string
    title?: string
    subtitle?: string
    placeholder?: string
    showsTitle?: boolean
    hideError?: boolean
    hiddenBackground?: boolean
    getPickerControllerTitle?: (entity: CurrencyTableRow) => string
    getPickerItemTitle?: (entity: CurrencyTableRow) => string
}

export function CurrencyInput({
    control,
    fieldName,
    title,
    subtitle,
    placeholder,
    showsTitle = true,
    hideError = false,
    hiddenBackground = false,
    getPickerControllerTitle,
    getPickerItemTitle
}: CurrencyInputProps) {
    const { t } = useTranslation();
    const { currencyDao } = useDatabase();

    const queryOptions = useMemo(() => {
        const getTitle = ((entity: CurrencyTableRow) => `${ t(`currency.names.${ entity.key }`) } - ${ entity.symbol }`);

        return currencyDao.pickerInfiniteQuery({
            getControllerTitle: getPickerControllerTitle ?? getTitle,
            getTitle: getPickerItemTitle ?? getTitle
        });
    }, [t, getPickerControllerTitle, getPickerItemTitle]);

    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
            fieldNameText={ showsTitle ? title ?? t("currency.text") : undefined }
            fieldInfoText={ subtitle }
            hideError={ hideError }
        >
            <Input.Picker.Dropdown<typeof queryOptions["baseQuery"]>
                title={ title ?? t("currency.text") }
                queryOptions={ queryOptions }
                searchBy={ ["key", "symbol"] }
                inputPlaceholder={ placeholder }
                hiddenBackground={ hiddenBackground }
            />
        </Input.Field>
    );
}