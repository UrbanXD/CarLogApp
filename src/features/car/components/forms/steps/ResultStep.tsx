import { CarFormFields } from "../../../schemas/form/carForm.ts";
import { MoreDataLoading } from "../../../../../components/loading/MoreDataLoading.tsx";
import { Car } from "../../../schemas/carSchema.ts";
import CarProfile from "../../carProfile/CarProfile.ts";
import React, { useEffect, useState } from "react";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { FuelUnit } from "../../../_features/fuel/schemas/fuelUnitSchema.ts";
import { FuelType } from "../../../_features/fuel/schemas/fuelTypeSchema.ts";
import { OdometerUnit } from "../../../_features/odometer/schemas/odometerUnitSchema.ts";

type ResultStepProps = {
    formValues: CarFormFields
    goTo: (stepIndex?: number) => void
}

export function ResultStep({
    formValues,
    goTo
}: ResultStepProps) {
    const { fuelTypeDao, fuelUnitDao, odometerUnitDao } = useDatabase();

    const [fuelUnit, setFuelUnit] = useState<FuelUnit | null>(null);
    const [fuelType, setFuelType] = useState<FuelType | null>(null);
    const [odometerUnit, setOdometerUnit] = useState<OdometerUnit | null>(null);

    useEffect(() => {
        if(!formValues.fuelTank.unitId || !formValues.fuelTank.typeId || !formValues.odometer.unitId) return;

        (async () => {
            setFuelUnit(await fuelUnitDao.getById(formValues.fuelTank.unitId));
            setFuelType(await fuelTypeDao.getById(formValues.fuelTank.typeId));
            setOdometerUnit(await odometerUnitDao.getById(formValues.odometer.unitId));
        })();
    }, [formValues.fuelTank.typeId, formValues.fuelTank.unitId, formValues.odometer.unitId]);


    if(!fuelType || !fuelUnit || !odometerUnit) return <MoreDataLoading/>;

    const car: Car = {
        name: formValues.name,
        model: {
            id: formValues.model.id,
            name: formValues.model.name,
            make: { id: formValues.model.makeId, name: formValues.model.makeName },
            year: formValues.model.year
        },
        odometer: {
            value: formValues.odometer.value,
            unit: odometerUnit
        },
        fuelTank: {
            type: fuelType,
            unit: fuelUnit,
            capacity: formValues.fuelTank.capacity,
            value: formValues.fuelTank.value
        },
        image: formValues.image
    };

    return <CarProfile.ByObj car={ car } goTo={ goTo }/>;
}