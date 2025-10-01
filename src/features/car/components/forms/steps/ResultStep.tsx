import { CarFormFields } from "../../../schemas/form/carForm.ts";
import { MoreDataLoading } from "../../../../../components/loading/MoreDataLoading.tsx";
import { Car } from "../../../schemas/carSchema.ts";
import CarProfile from "../../carProfile/CarProfile.ts";
import React, { useEffect, useState } from "react";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { FuelUnit } from "../../../_features/fuel/schemas/fuelUnitSchema.ts";
import { FuelType } from "../../../_features/fuel/schemas/fuelTypeSchema.ts";

type ResultStepProps = {
    formValues: CarFormFields
    goTo: (stepIndex?: number) => void
}

export function ResultStep({
    formValues,
    goTo
}: ResultStepProps) {
    const { fuelTypeDao, fuelUnitDao } = useDatabase();

    const [fuelUnit, setFuelUnit] = useState<FuelUnit | null>(null);
    const [fuelType, setFuelType] = useState<FuelType | null>(null);

    useEffect(() => {
        if(!formValues.fuelTank.unitId || !formValues.fuelTank.typeId) return;

        (async () => {
            setFuelUnit(await fuelUnitDao.getById(formValues.fuelTank.unitId));
            setFuelType(await fuelTypeDao.getById(formValues.fuelTank.typeId));
        })();
    }, [formValues.fuelTank.typeId, formValues.fuelTank.unitId]);


    if(!fuelType || !fuelUnit) return <MoreDataLoading/>;

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
            unit: formValues.odometer.unit
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