import React from "react";
import CarProfileView from "./CarProfileView.tsx";
import { Car } from "../../schemas/carSchema.ts";
import { CAR_FORM_STEPS, EDIT_CAR_FORM_STEPS } from "../../constants/index.ts";

type CarProfileByObjProps = {
    car: Partial<Car>
    goTo: (stepIndex: number) => void
}

function CarProfileByObj({ car, goTo }: CarProfileByObjProps) {
    const openEditCarStep = (stepIndex: EDIT_CAR_FORM_STEPS) => {
        switch(stepIndex) {
            case EDIT_CAR_FORM_STEPS.Name:
                goTo(CAR_FORM_STEPS.NameStep);
                break;
            case EDIT_CAR_FORM_STEPS.CarModel:
                goTo(CAR_FORM_STEPS.CarModelStep);
                break;
            case EDIT_CAR_FORM_STEPS.Image:
                goTo(CAR_FORM_STEPS.ImageStep);
                break;
            case EDIT_CAR_FORM_STEPS.FuelUnit:
            case EDIT_CAR_FORM_STEPS.FuelType:
            case EDIT_CAR_FORM_STEPS.FuelTankCapacity:
                goTo(CAR_FORM_STEPS.FuelStep);
                break;
            case EDIT_CAR_FORM_STEPS.OdometerUnit:
                goTo(CAR_FORM_STEPS.OdometerStep);
                break;
        }
    };

    return (
        <CarProfileView
            car={ car as Car }
            imageIsAttachment={ false }
            openEditCarStep={ openEditCarStep }
            openEditOdometerValue={ () => goTo(CAR_FORM_STEPS.OdometerStep) }
        />
    );
}

export default CarProfileByObj;