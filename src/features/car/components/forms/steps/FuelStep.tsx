import React, { useEffect, useState } from "react";
import Input from "../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { StepProps } from "../../../../../types/index.ts";
import { CarFormFields } from "../../../schemas/form/carForm.ts";
import { FuelType } from "../../../_features/fuel/schemas/fuelTypeSchema.ts";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { FuelUnit } from "../../../_features/fuel/schemas/fuelUnitSchema.ts";
import { MoreDataLoading } from "../../../../../components/loading/MoreDataLoading.tsx";

type FuelStepProps<FormFields> = Pick<StepProps<FormFields>, "control">

function FuelStep<FormFields = CarFormFields>({ control }: FuelStepProps<FormFields>) {
    const { fuelTypeDao, fuelUnitDao } = useDatabase();

    const [fuelTypes, setFuelTypes] = useState<Array<FuelType>>();
    const [fuelUnits, setFuelUnits] = useState<Array<FuelUnit>>();

    useEffect(() => {
        (async () => {
            const fuelTypesDto = await fuelTypeDao.getAll();
            const fuelUnitsDto = await fuelUnitDao.getAll();

            setFuelTypes(fuelTypeDao.mapper.dtoToPicker(fuelTypesDto));
            setFuelUnits(fuelUnitDao.mapper.dtoToPicker(fuelUnitsDto));
        })();
    }, []);


    return (
        <Input.Group>
            <Input.Field
                control={ control }
                fieldName="fuelTank.capacity"
                fieldNameText="Tartály mérete"
            >
                <Input.Text
                    icon={ ICON_NAMES.odometer }
                    placeholder={ "250" }
                    numeric
                />
            </Input.Field>
            <Input.Field
                control={ control }
                fieldName="fuelTank.typeId"
                fieldNameText="Típus"
            >
                {
                    fuelTypes
                    ?
                    <Input.Picker.Simple items={ fuelTypes }/>
                    :
                    <MoreDataLoading/>
                }
            </Input.Field>
            <Input.Field
                control={ control }
                fieldName="fuelTank.unitId"
                fieldNameText="Mértékegység"
            >
                {
                    fuelUnits
                    ?
                    <Input.Picker.Simple items={ fuelUnits }/>
                    :
                    <MoreDataLoading/>
                }
            </Input.Field>
        </Input.Group>
    );
}

export default FuelStep;