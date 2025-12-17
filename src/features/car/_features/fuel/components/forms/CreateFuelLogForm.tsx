import MultiStepForm from "../../../../../../components/Form/MultiStepForm.tsx";
import React from "react";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import useCars from "../../../../hooks/useCars.ts";
import { FormState, useForm } from "react-hook-form";
import { useFuelLogFormFields } from "../../hooks/useFuelLogForm.tsx";
import { FuelLogFields, useCreateFuelLogFormProps } from "../../schemas/form/fuelLogForm.ts";
import { updateCarOdometer } from "../../../../model/slice/index.ts";
import { useAppDispatch } from "../../../../../../hooks/index.ts";
import { CreateToast, InvalidFormToast } from "../../../../../../ui/alert/presets/toast/index.ts";
import { useTranslation } from "react-i18next";
import { SubmitHandlerArgs } from "../../../../../../types/index.ts";

type CreateFuelLogFormProps = {
    onFormStateChange?: (formState: FormState<FuelLogFields>) => void
}

export function CreateFuelLogForm({ onFormStateChange }: CreateFuelLogFormProps) {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();
    const { fuelLogDao } = useDatabase();
    const { selectedCar } = useCars();

    const form = useForm<FuelLogFields>(useCreateFuelLogFormProps(selectedCar));
    const { multiStepFormSteps } = useFuelLogFormFields(form);

    const submitHandler: SubmitHandlerArgs<FuelLogFields> = {
        onValid: async (formResult) => {
            try {
                const result = await fuelLogDao.create(formResult);
                if(result?.odometer) dispatch(updateCarOdometer({ odometer: result.odometer }));

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