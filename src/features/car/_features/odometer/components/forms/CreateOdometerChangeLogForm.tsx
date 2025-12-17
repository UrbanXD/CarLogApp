import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../../../../../hooks/index.ts";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import {
    OdometerChangeLogFormFields,
    useCreateOdometerChangeLogFormProps
} from "../../schemas/form/odometerChangeLogForm.ts";
import { updateCarOdometer } from "../../../../model/slice/index.ts";
import { FormState, useForm, useWatch } from "react-hook-form";
import useCars from "../../../../hooks/useCars.ts";
import { Car } from "../../../../schemas/carSchema.ts";
import { useOdometerLogFormFields } from "../../hooks/useOdometerLogFormFields.tsx";
import Form from "../../../../../../components/Form/Form.tsx";
import { CreateToast, InvalidFormToast } from "../../../../../../ui/alert/presets/toast/index.ts";
import { useTranslation } from "react-i18next";
import { SubmitHandlerArgs } from "../../../../../../types/index.ts";

type CreateOdometerLogFormProps = {
    defaultCarId?: string
    onFormStateChange?: (formState: FormState<OdometerChangeLogFormFields>) => void
}

export function CreateOdometerChangeLogForm({ defaultCarId, onFormStateChange }: CreateOdometerLogFormProps) {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();
    const { odometerLogDao } = useDatabase();
    const { selectedCar, getCar } = useCars();

    const [car, setCar] = useState<Car | null>(defaultCarId ? getCar(defaultCarId) ?? selectedCar : selectedCar);

    const form = useForm<OdometerChangeLogFormFields>(useCreateOdometerChangeLogFormProps(car));
    const { control, setValue, clearErrors, getFieldState } = form;
    const { fullForm } = useOdometerLogFormFields({ ...form, defaultCarId });

    const formCarId = useWatch({ control, name: "carId" });

    useEffect(() => {
        const car = getCar(formCarId);
        setCar(car ?? null);
        setValue("ownerId", car?.ownerId);
        setValue("conversionFactor", car?.odometer.unit.conversionFactor ?? 1);
        clearErrors();
    }, [formCarId]);

    useEffect(() => {
        if(car && !getFieldState("value").isDirty) {
            setValue("value", car.odometer.value ?? 0);
        }
    }, [car?.odometer.value]);

    const submitHandler: SubmitHandlerArgs<OdometerChangeLogFormFields> = {
        onValid: async (formResult: OdometerChangeLogFormFields) => {
            try {
                const result = await odometerLogDao.createOdometerChangeLog(formResult);
                const odometer = await odometerLogDao.getOdometerByCarId(result.carId);

                dispatch(updateCarOdometer({ odometer }));

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