import { useDatabase } from "../../../../../../../contexts/database/DatabaseContext.ts";
import React, { useEffect, useState } from "react";
import { OdometerUnit } from "../../../schemas/odometerUnitSchema.ts";
import { Control } from "react-hook-form";
import Input from "../../../../../../../components/Input/Input.ts";
import { MoreDataLoading } from "../../../../../../../components/loading/MoreDataLoading.tsx";
import { useTranslation } from "react-i18next";

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

    const [odometerUnits, setOdometerUnits] = useState<Array<OdometerUnit>>();

    useEffect(() => {
        (async () => {
            const odometerUnitsDto = await odometerUnitDao.getAll();

            setOdometerUnits(odometerUnitDao.mapper.dtoToPicker(odometerUnitsDto));
        })();
    }, []);

    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
            fieldNameText={ title ?? t("odometer.unit") }
            fieldInfoText={ subtitle }
        >
            {
                odometerUnits
                ?
                <Input.Picker.Simple items={ odometerUnits }/>
                :
                <MoreDataLoading/>
            }
        </Input.Field>
    );
}