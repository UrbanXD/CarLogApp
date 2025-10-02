import React, { useEffect, useState } from "react";
import Input from "../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { StepProps } from "../../../../../types/index.ts";
import { CarFormFields } from "../../../schemas/form/carForm.ts";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { OdometerUnit } from "../../../_features/odometer/schemas/odometerUnitSchema.ts";
import { MoreDataLoading } from "../../../../../components/loading/MoreDataLoading.tsx";

type OdometerStepProps<FormFields> = Pick<StepProps<FormFields>, "control">;

function OdometerStep<FormFields = CarFormFields>({ control }: OdometerStepProps<FormFields>) {
    const { odometerUnitDao } = useDatabase();

    const [odometerUnits, setOdometerUnits] = useState<Array<OdometerUnit>>();

    useEffect(() => {
        (async () => {
            const odometerUnitsDto = await odometerUnitDao.getAll();

            setOdometerUnits(odometerUnitDao.mapper.dtoToPicker(odometerUnitsDto));
        })();
    }, []);

    return (
        <Input.Group>
            <Input.Field
                control={ control }
                fieldName="odometer.value"
                fieldNameText="Kilóméteróra állás"
            >
                <Input.Text
                    icon={ ICON_NAMES.odometer }
                    placeholder="100000"
                    numeric
                />
            </Input.Field>
            <Input.Field
                control={ control }
                fieldName="odometer.unitId"
                fieldNameText="Mértékegység"
            >
                {
                    odometerUnits
                    ?
                    <Input.Picker.Simple items={ odometerUnits }/>
                    :
                    <MoreDataLoading/>
                }
            </Input.Field>
        </Input.Group>
    );
}

export default OdometerStep;