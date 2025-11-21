import { useDatabase } from "../../../../../../../contexts/database/DatabaseContext.ts";
import React, { useEffect, useState } from "react";
import Input from "../../../../../../../components/Input/Input.ts";
import { MoreDataLoading } from "../../../../../../../components/loading/MoreDataLoading.tsx";
import { PickerItemType } from "../../../../../../../components/Input/picker/PickerItem.tsx";
import { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";

type FuelUnitInputProps = {
    control: Control<any>
    fieldName: string
    title?: string
    subtitle?: string
}

export function FuelUnitInput({
    control,
    fieldName,
    title,
    subtitle
}: FuelUnitInputProps) {
    const { t } = useTranslation();
    const { fuelUnitDao } = useDatabase();

    const [fuelUnits, setFuelUnits] = useState<Array<PickerItemType>>();

    useEffect(() => {
        (async () => {
            const fuelUnitsDto = await fuelUnitDao.getAll();
            setFuelUnits(fuelUnitDao.mapper.dtoToPicker(fuelUnitsDto));
        })();
    }, []);

    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
            fieldNameText={ title ?? t("fuel.unit") }
            fieldInfoText={ subtitle }
        >
            {
                fuelUnits
                ?
                <Input.Picker.Simple items={ fuelUnits }/>
                :
                <MoreDataLoading/>
            }
        </Input.Field>
    );
}