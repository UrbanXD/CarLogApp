import NameStep from "../components/forms/steps/NameStep.tsx";
import React, { ReactNode } from "react";
import { CarEditNameToast } from "../presets/toast/index.ts";
import { StepProps, UseStepFormResult } from "../../../types/index.ts";
import OdometerStep from "../components/forms/steps/OdometerStep.tsx";
import CarModelStep from "../components/forms/steps/CarModelStep.tsx";
import FuelStep from "../components/forms/steps/FuelStep.tsx";
import ImageStep from "../components/forms/steps/ImageStep.tsx";
import CarProfile from "../components/carProfile/CarProfile.ts";
import { Car } from "../schemas/carSchema.ts";
import { CarFormFields } from "../schemas/form/carForm.ts";

function useCarSteps({ control, resetField, setValue, getValues }: StepProps<CarFormFields>): UseStepFormResult {
    return {
        steps: [
            {
                title: "Elnevezés",
                fields: ["name"],
                render: () => <NameStep control={ control }/>,
                editToastMessages: CarEditNameToast
            },
            {
                title: "Modell",
                fields: ["model.makeId", "model.id", "model.year"],
                render: () => <CarModelStep control={ control } resetField={ resetField } setValue={ setValue }/>,
                editToastMessages: CarEditNameToast
            },
            {
                title: "Kilométeróra",
                fields: ["odometer.value", "odometer.measurement"],
                render: () => <OdometerStep control={ control }/>,
                editToastMessages: CarEditNameToast
            },
            {
                title: "Üzemanyag",
                fields: ["fuelTank.type", "fuelTank.measurement", "fuelTank.capacity"],
                render: () => <FuelStep control={ control }/>,
                editToastMessages: CarEditNameToast
            },
            {
                title: "Kép",
                fields: ["image"],
                render: () => <ImageStep control={ control }/>,
                editToastMessages: CarEditNameToast
            }
        ],
        resultStep: getValues && {
            type: "result",
            render: (goTo): ReactNode => {
                const values = getValues();

                const car: Car = {
                    name: values.name,
                    model: {
                        id: values.model.id,
                        name: values.model.name,
                        make: { id: values.model.makeId, name: values.model.makeName },
                        year: values.model.year
                    },
                    odometer: {
                        value: values.odometer.value,
                        measurement: values.odometer.measurement
                    },
                    fuelTank: {
                        type: values.fuelTank.type,
                        capacity: values.fuelTank.capacity,
                        value: values.fuelTank.value,
                        measurement: values.fuelTank.measurement
                    },
                    image: values.image
                };

                return <CarProfile.ByObj car={ car } goTo={ goTo }/>;
            }
        }
    };
}

export default useCarSteps;