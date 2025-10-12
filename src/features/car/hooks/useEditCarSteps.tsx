import { FormFields } from "../../../types/index.ts";
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

export function useEditCarSteps({ control, resetField, setValue, index, car }: UseEditCarStepsArgs): FormFields {
    const steps: Record<EDIT_CAR_FORM_STEPS, FormFields> = {
        [EDIT_CAR_FORM_STEPS.Name]: {
            render: () => <NameStep control={ control }/>,
            editToastMessages: CarEditNameToast
        },
        [EDIT_CAR_FORM_STEPS.CarModel]: {
            render: () => <CarModelStep
                control={ control }
                resetField={ resetField }
                setValue={ setValue }
            />,
            editToastMessages: CarEditNameToast
        },
        [EDIT_CAR_FORM_STEPS.Image]: {
            render: () => <ImageStep control={ control }/>,
            editToastMessages: CarEditNameToast
        },
        [EDIT_CAR_FORM_STEPS.OdometerUnit]: {
            render: () => <OdometerUnitInput control={ control } fieldName="odometer.unitId"/>,
            editToastMessages: CarEditNameToast
        },
        [EDIT_CAR_FORM_STEPS.FuelType]: {
            render: () => <FuelTypeInput control={ control } fieldName="fuelTank.typeId"/>,
            editToastMessages: CarEditNameToast
        },
        [EDIT_CAR_FORM_STEPS.FuelTankCapacity]: {
            render: () => <FuelTankCapacityInput
                control={ control }
                fieldName="fuelTank.capacity"
                unitText={ car.fuelTank.unit.short }
            />,
            editToastMessages: CarEditNameToast
        },
        [EDIT_CAR_FORM_STEPS.FuelUnit]: {
            render: () => <FuelUnitInput control={ control } fieldName="fuelTank.unitId"/>,
            editToastMessages: CarEditNameToast
        },
        [EDIT_CAR_FORM_STEPS.Currency]: {
            render: () => <CurrencyInput control={ control } fieldName="currencyId"/>,
            editToastMessages: CarEditNameToast
        }
    };

    return steps[index];
}