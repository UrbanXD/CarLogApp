import { useDatabase } from "../../../../../../../contexts/database/DatabaseContext.ts";
import React, { useEffect, useState } from "react";
import Input from "../../../../../../../components/Input/Input.ts";
import { MoreDataLoading } from "../../../../../../../components/loading/MoreDataLoading.tsx";
import { PickerItemType } from "../../../../../../../components/Input/picker/PickerItem.tsx";
import { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FuelUnit } from "../../../schemas/fuelUnitSchema.ts";

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

    const [rawFuelUnits, setRawFuelUnits] = useState<Array<FuelUnit> | null>(null);
    const [fuelUnits, setFuelUnits] = useState<Array<PickerItemType>>([]);

    useEffect(() => {
        (async () => {
            setRawFuelUnits(await fuelUnitDao.getAll());
        })();
    }, []);

    useEffect(() => {
        if(!rawFuelUnits) return;

        setFuelUnits(fuelUnitDao.mapper.dtoToPicker(
            rawFuelUnits,
            (dto) => `${ t(`fuel.unit_types.${ dto.key }`) } (${ dto.short })`
        ));
    }, [rawFuelUnits, t]);

    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
            fieldNameText={ title ?? t("fuel.unit") }
            fieldInfoText={ subtitle }
        >
            {
                rawFuelUnits
                ?
                <Input.Picker.Simple items={ fuelUnits }/>
                :
                <MoreDataLoading/>
            }
        </Input.Field>
    );
}