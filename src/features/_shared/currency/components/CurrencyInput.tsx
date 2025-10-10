import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import React, { useEffect, useState } from "react";
import { PickerItemType } from "../../../../components/Input/picker/PickerItem.tsx";
import Input from "../../../../components/Input/Input.ts";
import { MoreDataLoading } from "../../../../components/loading/MoreDataLoading.tsx";
import { Control } from "react-hook-form";

type CurrencyInputProps = {
    control: Control<any>
    fieldName: string
    title?: string
    subtitle?: string
}

export function CurrencyInput({
    control,
    fieldName,
    title = "Valuta",
    subtitle
}: CurrencyInputProps) {
    const { currencyDao } = useDatabase();

    const [currencies, setCurrencies] = useState<Array<PickerItemType> | null>(null);

    useEffect(() => {
        (async () => {
            const currenciesDto = await currencyDao.getAll();
            setCurrencies(currencyDao.mapper.dtoToPicker(currenciesDto, (dto) => `${ dto.key } - ${ dto.symbol }`));
        })();
    }, []);

    return (
        <Input.Field control={ control } fieldName={ fieldName } fieldNameText={ title } fieldInfoText={ subtitle }>
            {
                currencies
                ?
                <Input.Picker.Dropdown data={ currencies } title={ title }/>
                :
                <MoreDataLoading/>
            }
        </Input.Field>
    );
}