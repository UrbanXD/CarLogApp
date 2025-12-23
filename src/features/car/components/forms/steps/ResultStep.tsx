import { CarFormFields } from "../../../schemas/form/carForm.ts";
import { MoreDataLoading } from "../../../../../components/loading/MoreDataLoading.tsx";
import { carSchema } from "../../../schemas/carSchema.ts";
import CarProfile from "../../carProfile/CarProfile.ts";
import React, { useEffect, useState } from "react";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { FuelUnit } from "../../../_features/fuel/schemas/fuelUnitSchema.ts";
import { FuelType } from "../../../_features/fuel/schemas/fuelTypeSchema.ts";
import { OdometerUnit } from "../../../_features/odometer/schemas/odometerUnitSchema.ts";
import { Currency } from "../../../../_shared/currency/schemas/currencySchema.ts";

type ResultStepProps = {
    formValues: CarFormFields
    goTo: (stepIndex?: number) => void
}

export function ResultStep({
    formValues,
    goTo
}: ResultStepProps) {
    const { fuelTypeDao, fuelUnitDao, odometerUnitDao, currencyDao } = useDatabase();

    const [fuelUnit, setFuelUnit] = useState<FuelUnit | null>(null);
    const [fuelType, setFuelType] = useState<FuelType | null>(null);
    const [odometerUnit, setOdometerUnit] = useState<OdometerUnit | null>(null);
    const [currency, setCurrency] = useState<Currency | null>(null);

    useEffect(() => {
        (async () => {
            if(!formValues.currencyId) return;

            setCurrency(await currencyDao.getById(formValues.currencyId));
        })();
    }, [formValues.currencyId]);

    useEffect(() => {
        (async () => {
            if(!formValues.fuelTank.typeId) return;

            setFuelType(await fuelTypeDao.getById(formValues.fuelTank.typeId));
        })();
    }, [formValues.fuelTank.typeId]);

    useEffect(() => {
        (async () => {
            if(!formValues.fuelTank.unitId) return;

            setFuelUnit(await fuelUnitDao.getById(formValues.fuelTank.unitId));
        })();
    }, [formValues.fuelTank.unitId]);

    useEffect(() => {
        (async () => {
            if(!formValues.odometer.unitId) return;

            setOdometerUnit(await odometerUnitDao.getById(formValues.odometer.unitId));
        })();
    }, [formValues.odometer.unitId]);


    if(!fuelType || !fuelUnit || !odometerUnit || !currency) return <MoreDataLoading/>;

    const { data, error } = carSchema.partial().safeParse({
        id: formValues.id,
        name: formValues.name,
        model: {
            id: formValues.model.id,
            name: formValues.model.name,
            make: { id: formValues.model.makeId, name: formValues.model.makeName },
            year: formValues.model.year
        },
        odometer: {
            id: formValues.odometer.id,
            carId: formValues.id,
            value: Number(formValues.odometer.value),
            valueInKm: Number(formValues.odometer.value),
            unit: odometerUnit
        },
        currency,
        fuelTank: {
            id: formValues.fuelTank.id,
            type: fuelType,
            unit: fuelUnit,
            capacity: Number(formValues.fuelTank.capacity)
        },
        image: formValues.image
    });

    if(!data) return <></>;

    return <CarProfile.ByObj car={ data } goTo={ goTo }/>;
}