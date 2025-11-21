import Input from "../../../../../../../components/Input/Input.ts";
import { MoreDataLoading } from "../../../../../../../components/loading/MoreDataLoading.tsx";
import React, { useEffect, useState } from "react";
import { Control } from "react-hook-form";
import { useDatabase } from "../../../../../../../contexts/database/DatabaseContext.ts";
import { PickerItemType } from "../../../../../../../components/Input/picker/PickerItem.tsx";
import { useTranslation } from "react-i18next";

type FuelTypeInputProps = {
    control: Control<any>
    fieldName: string
    title?: string
    subtitle?: string
}

export function FuelTypeInput({
    control,
    fieldName,
    title,
    subtitle
}: FuelTypeInputProps) {
    const { t } = useTranslation();
    const { fuelTypeDao } = useDatabase();

    const [fuelTypes, setFuelTypes] = useState<Array<PickerItemType>>();

    useEffect(() => {
        (async () => {
            const fuelTypesDto = await fuelTypeDao.getAll();
            setFuelTypes(fuelTypeDao.mapper.dtoToPicker(fuelTypesDto));
        })();
    }, []);

    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
            fieldNameText={ title ?? t("fuel.type") }
            fieldInfoText={ subtitle }
        >
            {
                fuelTypes
                ?
                <Input.Picker.Simple items={ fuelTypes }/>
                :
                <MoreDataLoading/>
            }
        </Input.Field>
    );
}