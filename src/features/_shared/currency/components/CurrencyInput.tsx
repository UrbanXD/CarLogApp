import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import React, { useEffect, useState } from "react";
import { PickerItemType } from "../../../../components/Input/picker/PickerItem.tsx";
import Input from "../../../../components/Input/Input.ts";
import { MoreDataLoading } from "../../../../components/loading/MoreDataLoading.tsx";
import { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Currency } from "../schemas/currencySchema.ts";

type CurrencyInputProps = {
    control: Control<any>
    fieldName: string
    title?: string
    subtitle?: string
}

export function CurrencyInput({
    control,
    fieldName,
    title,
    subtitle
}: CurrencyInputProps) {
    const { t } = useTranslation();
    const { currencyDao } = useDatabase();

    const [rawCurrencies, setRawCurrencies] = useState<Array<Currency> | null>(null);
    const [currencies, setCurrencies] = useState<Array<PickerItemType>>([]);

    useEffect(() => {
        (async () => {
            setRawCurrencies(await currencyDao.getAll());
        })();
    }, []);

    useEffect(() => {
        if(!rawCurrencies) return;

        setCurrencies(
            currencyDao.mapper.dtoToPicker({
                dtos: rawCurrencies,
                getControllerTitle: (dto) => `${ t(`currency.names.${ dto.key }`) } - ${ dto.symbol }`
            })
        );
    }, [rawCurrencies, t]);

    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
            fieldNameText={ title ?? t("currency.text") }
            fieldInfoText={ subtitle }
        >
            {
                rawCurrencies
                ?
                <Input.Picker.Dropdown data={ currencies } title={ title ?? t("currency.text") }/>
                :
                <MoreDataLoading/>
            }
        </Input.Field>
    );
}