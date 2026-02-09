import React, { useMemo } from "react";
import { FormState, useForm } from "react-hook-form";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { CarFormFields, useEditCarFormProps } from "../../schemas/form/carForm.ts";
import { Car } from "../../schemas/carSchema.ts";
import { EDIT_CAR_FORM_STEPS } from "../../constants";
import { useEditCarSteps } from "../../hooks/useEditCarSteps.tsx";
import { InvalidFormToast } from "../../../../ui/alert/presets/toast";
import { Form } from "../../../../components/Form/Form.tsx";
import { SubmitHandlerArgs } from "../../../../types";

export type EditCarFormProps = {
    car: Car
    stepIndex: EDIT_CAR_FORM_STEPS
    onFormStateChange?: (formState: FormState<CarFormFields>) => void
}

export function EditCarForm({
    car,
    stepIndex,
    onFormStateChange
}: EditCarFormProps) {
    const { carDao, attachmentQueue } = useDatabase();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();

    const form = useForm<CarFormFields>(useEditCarFormProps(car, attachmentQueue));
    const editFields = useEditCarSteps({ ...form, index: stepIndex, car });

    const submitHandler: SubmitHandlerArgs<CarFormFields> = useMemo(() => ({
        onValid: async (formResult) => {
            try {
                await carDao.updateFromFormResult(formResult);

                if(dismissBottomSheet) dismissBottomSheet(true);
                openToast(editFields.editToastMessages.success());
            } catch(e) {
                openToast(editFields.editToastMessages.error());
                console.error("Hiba a submitHandler-ben:", e);
            }
        },
        onInvalid: (errors) => {
            console.log("Edit car validation errors", errors);
            openToast(InvalidFormToast.warning());
        }
    }), [editFields]);

    return (
        <Form
            edit
            form={ form }
            formFields={ editFields.render() }
            submitHandler={ submitHandler }
            onFormStateChange={ onFormStateChange }
        />
    );
}