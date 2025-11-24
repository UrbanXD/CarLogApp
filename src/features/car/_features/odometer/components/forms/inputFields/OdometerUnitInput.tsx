import { useDatabase } from "../../../../../../../contexts/database/DatabaseContext.ts";
import React, { useEffect, useState } from "react";
import { OdometerUnit } from "../../../schemas/odometerUnitSchema.ts";
import { Control } from "react-hook-form";
import Input from "../../../../../../../components/Input/Input.ts";
import { MoreDataLoading } from "../../../../../../../components/loading/MoreDataLoading.tsx";
import { useTranslation } from "react-i18next";
import { PickerItemType } from "../../../../../../../components/Input/picker/PickerItem.tsx";

type OdometerUnitInputProps = {
    control: Control<any>
    fieldName: string
    title?: string
    subtitle?: string
}

export function OdometerUnitInput({
    control,
    fieldName,
    title,
    subtitle
}: OdometerUnitInputProps) {
    const { t } = useTranslation();
    const { odometerUnitDao } = useDatabase();

    const [rawOdometerUnits, setRawOdometerUnits] = useState<Array<OdometerUnit> | null>(null);
    const [odometerUnits, setOdometerUnits] = useState<Array<PickerItemType>>([]);

    useEffect(() => {
        (async () => {
            setRawOdometerUnits(await odometerUnitDao.getAll());
        })();
    }, []);

    useEffect(() => {
        if(!rawOdometerUnits) return;

        setOdometerUnits(
            odometerUnitDao.mapper.dtoToPicker(
                rawOdometerUnits,
                (dto) => `${ t(`odometer.unit_types.${ dto.key }`) } (${ dto.short })`
            )
        );
    }, [rawOdometerUnits, t]);

    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
            fieldNameText={ title ?? t("odometer.unit") }
            fieldInfoText={ subtitle }
        >
            {
                rawOdometerUnits
                ?
                <Input.Picker.Simple items={ odometerUnits }/>
                :
                <MoreDataLoading/>
            }
        </Input.Field>
    );
}