import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { FormState, useForm } from "react-hook-form";
import { ServiceLogFormFields, useCreateServiceLogFormProps } from "../../schemas/form/serviceLogForm.ts";
import MultiStepForm from "../../../../../../components/Form/MultiStepForm.tsx";
import React from "react";
import { useServiceLogFormFields } from "../../hooks/useServiceLogForm.tsx";
import { CreateToast, InvalidFormToast } from "../../../../../../ui/alert/presets/toast";
import { useTranslation } from "react-i18next";
import { SubmitHandlerArgs } from "../../../../../../types";
import { useSelectedCarId } from "../../../../../car/hooks/useSelectedCarId.ts";

type CreateServiceLogFormProps = {
    onFormStateChange?: (formState: FormState<ServiceLogFormFields>) => void
}

export function CreateServiceLogForm({ onFormStateChange }: CreateServiceLogFormProps) {
    const { t } = useTranslation();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();
    const { serviceLogDao } = useDatabase();
    const { selectedCarId } = useSelectedCarId();

    const form = useForm<ServiceLogFormFields, any, ServiceLogFormFields>(useCreateServiceLogFormProps(selectedCarId));
    const { multiStepFormSteps } = useServiceLogFormFields({ form });

    const submitHandler: SubmitHandlerArgs<ServiceLogFormFields> = {
        onValid: async (formResult) => {
            try {
                await serviceLogDao.createFromFormResult(formResult);

                openToast(CreateToast.success(t("service.log")));
                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(CreateToast.error(t("service.log")));
                console.error("Hiba a submitHandler-ben log:", e);
            }
        },
        onInvalid: (errors) => {
            console.log("Create service log validation errors", errors);
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