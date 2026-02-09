import MultiStepForm from "../../../../../../components/Form/MultiStepForm.tsx";
import React from "react";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { FormState, useForm } from "react-hook-form";
import { useFuelLogFormFields } from "../../hooks/useFuelLogForm.tsx";
import { FuelLogFormFields, useCreateFuelLogFormProps } from "../../schemas/form/fuelLogForm.ts";
import { CreateToast, InvalidFormToast } from "../../../../../../ui/alert/presets/toast";
import { useTranslation } from "react-i18next";
import { SubmitHandlerArgs } from "../../../../../../types";
import { Car } from "../../../../schemas/carSchema.ts";

type CreateFuelLogFormProps = {
    car: Car | null
    onFormStateChange?: (formState: FormState<FuelLogFormFields>) => void
}

export function CreateFuelLogForm({ car, onFormStateChange }: CreateFuelLogFormProps) {
    const { t } = useTranslation();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();
    const { fuelLogDao } = useDatabase();

    const form = useForm<FuelLogFormFields, any, FuelLogFormFields>(useCreateFuelLogFormProps(car));
    const { multiStepFormSteps } = useFuelLogFormFields({ form });

    const submitHandler: SubmitHandlerArgs<FuelLogFormFields> = {
        onValid: async (formResult) => {
            try {
                await fuelLogDao.createFromFormResult(formResult);

                openToast(CreateToast.success(t("fuel.log")));
                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(CreateToast.error(t("fuel.log")));
                console.error("Hiba a submitHandler-ben log:", e);
            }
        },
        onInvalid: (errors) => {
            console.log("Create fuel log validation errors", errors);
            openToast(InvalidFormToast.warning());
        }
    };

    return (
        <MultiStepForm
            form={ form }
            steps={ multiStepFormSteps }
            submitHandler={ submitHandler }
            onFormStateChange={ onFormStateChange }
        />
    );
}