import React, { useEffect } from "react";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import {
    OdometerChangeLogFormFields,
    useCreateOdometerChangeLogFormProps
} from "../../schemas/form/odometerChangeLogForm.ts";
import { FormState, useForm, useWatch } from "react-hook-form";
import { Car } from "../../../../schemas/carSchema.ts";
import { useOdometerLogFormFields } from "../../hooks/useOdometerLogFormFields.tsx";
import Form from "../../../../../../components/Form/Form.tsx";
import { CreateToast, InvalidFormToast } from "../../../../../../ui/alert/presets/toast";
import { useTranslation } from "react-i18next";
import { SubmitHandlerArgs } from "../../../../../../types";
import { useCar } from "../../../../hooks/useCar.ts";

type CreateOdometerLogFormProps = {
    defaultCar: Car | null
    onFormStateChange?: (formState: FormState<OdometerChangeLogFormFields>) => void
}

export function CreateOdometerChangeLogForm({ defaultCar, onFormStateChange }: CreateOdometerLogFormProps) {
    const { t } = useTranslation();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();
    const { odometerLogDao } = useDatabase();

    const form = useForm<OdometerChangeLogFormFields, any, OdometerChangeLogFormFields>(
        useCreateOdometerChangeLogFormProps(defaultCar));
    const { control, setValue, clearErrors, getFieldState } = form;
    const { fullForm } = useOdometerLogFormFields({ form });

    const formCarId = useWatch({ control, name: "carId" });
    const { car } = useCar({ carId: formCarId, options: { queryOnce: true } });

    useEffect(() => {
        if(formCarId !== car?.id) return;

        setValue("conversionFactor", car?.odometer.unit.conversionFactor ?? 1);
        clearErrors();
    }, [formCarId, car]);

    useEffect(() => {
        if(formCarId !== car?.id) return;

        if(car && !getFieldState("value").isDirty) {
            setValue("value", car.odometer.value ?? 0);
        }
    }, [formCarId, car?.odometer.value]);

    const submitHandler: SubmitHandlerArgs<OdometerChangeLogFormFields> = {
        onValid: async (formResult) => {
            try {
                await odometerLogDao.createOdometerChangeLog(formResult);

                openToast(CreateToast.success(t("odometer.log")));
                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(CreateToast.error(t("odometer.log")));
                console.error("Hiba a submitHandler-ben log:", e);
            }
        },
        onInvalid: (errors) => {
            console.log("Create odometer log validation errors", errors);
            openToast(InvalidFormToast.warning());
        }
    };

    return (
        <Form
            form={ form }
            formFields={ fullForm.render() }
            submitHandler={ submitHandler }
            submitText={ t("form_button.record") }
            onFormStateChange={ onFormStateChange }
        />
    );
}