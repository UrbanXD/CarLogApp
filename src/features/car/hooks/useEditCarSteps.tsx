import { EditFields } from "../../../types/index.ts";
import { CarFormFields } from "../schemas/form/carForm.ts";
import React from "react";
import { EDIT_CAR_FORM_STEPS } from "../constants/index.ts";
import NameStep from "../components/forms/steps/NameStep.tsx";
import CarModelStep from "../components/forms/steps/CarModelStep.tsx";
import ImageStep from "../components/forms/steps/ImageStep.tsx";
import { OdometerUnitInput } from "../_features/odometer/components/forms/inputFields/OdometerUnitInput.tsx";
import { CarEditNameToast } from "../presets/toast/index.ts";
import { FuelTypeInput } from "../_features/fuel/components/forms/inputFields/FuelTypeInput.tsx";
import { FuelUnitInput } from "../_features/fuel/components/forms/inputFields/FuelUnitInput.tsx";
import { FuelTankCapacityInput } from "../_features/fuel/components/forms/inputFields/FuelTankCapacityInput.tsx";
import { UseFormReturn } from "react-hook-form";
import { Car } from "../schemas/carSchema.ts";
import { CurrencyInput } from "../../_shared/currency/components/CurrencyInput.tsx";

type UseEditCarStepsArgs = UseFormReturn<CarFormFields> & { index: EDIT_CAR_FORM_STEPS, car: Car }

export function useEditCarSteps({ control, resetField, setValue, index, car }: UseEditCarStepsArgs): EditFields {
    const steps: Record<EDIT_CAR_FORM_STEPS, EditFields> = {
        [EDIT_CAR_FORM_STEPS.Name]: {
            render: () => <NameStep control={ control }/>,
            toastMessages: CarEditNameToast
        },
        [EDIT_CAR_FORM_STEPS.CarModel]: {
            render: () => <CarModelStep
                control={ control }
                resetField={ resetField }
                setValue={ setValue }
            />,
            toastMessages: CarEditNameToast
        },
        [EDIT_CAR_FORM_STEPS.Image]: {
            render: () => <ImageStep control={ control }/>,
            toastMessages: CarEditNameToast
        },
        [EDIT_CAR_FORM_STEPS.OdometerUnit]: {
            render: () => <OdometerUnitInput control={ control } fieldName="odometer.unitId"/>,
            toastMessages: CarEditNameToast
        },
        [EDIT_CAR_FORM_STEPS.FuelType]: {
            render: () => <FuelTypeInput control={ control } fieldName="fuelTank.typeId"/>,
            toastMessages: CarEditNameToast
        },
        [EDIT_CAR_FORM_STEPS.FuelTankCapacity]: {
            render: () => <FuelTankCapacityInput
                control={ control }
                fieldName="fuelTank.capacity"
                unitText={ car.fuelTank.unit.short }
            />,
            toastMessages: CarEditNameToast
        },
        [EDIT_CAR_FORM_STEPS.FuelUnit]: {
            render: () => <FuelUnitInput control={ control } fieldName="fuelTank.unitId"/>,
            toastMessages: CarEditNameToast
        },
        [EDIT_CAR_FORM_STEPS.Currency]: {
            render: () => <CurrencyInput control={ control } fieldName="currencyId"/>,
            toastMessages: CarEditNameToast
        }
    };

    return steps[index];
}