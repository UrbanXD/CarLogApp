import { useAppDispatch } from "../../../../../../hooks/index.ts";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import useCars from "../../../../../car/hooks/useCars.ts";
import { useForm } from "react-hook-form";
import { ServiceLogFields, useCreateServiceLogFormProps } from "../../schemas/form/serviceLogForm.ts";
import { updateCarOdometer } from "../../../../../car/model/slice/index.ts";
import MultiStepForm from "../../../../../../components/Form/MultiStepForm.tsx";
import React from "react";
import { useServiceLogFormFields } from "../../hooks/useServiceLogForm.tsx";
import { CreateToast, InvalidFormToast } from "../../../../../../ui/alert/presets/toast/index.ts";
import { useTranslation } from "react-i18next";

export function CreateServiceLogForm() {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();
    const { serviceLogDao } = useDatabase();
    const { selectedCar } = useCars();

    const form = useForm<ServiceLogFields>(useCreateServiceLogFormProps(selectedCar));
    const { handleSubmit } = form;

    const { multiStepFormSteps } = useServiceLogFormFields(form);

    const submitHandler = handleSubmit(
        async (formResult: ServiceLogFields) => {
            try {
                const result = await serviceLogDao.create(formResult);
                if(result?.odometer) dispatch(updateCarOdometer({ odometer: result.odometer }));

                openToast(CreateToast.success(t("service.log")));

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(CreateToast.error(t("service.log")));
                console.error("Hiba a submitHandler-ben log:", e);
            }
        },
        (errors) => {
            console.log("Create service log validation errors", errors);
            openToast(InvalidFormToast.warning());
        }
    );

    return (
        <MultiStepForm
            steps={ multiStepFormSteps }
            submitHandler={ submitHandler }
            { ...form }
        />
    );
}