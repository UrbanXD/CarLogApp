import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { FormState, useForm } from "react-hook-form";
import { FormFields, SubmitHandlerArgs } from "../../../../types";
import React from "react";
import Form from "../../../../components/Form/Form.tsx";
import { RideLog } from "../../schemas/rideLogSchema.ts";
import { RideLogFormFieldsEnum } from "../../enums/RideLogFormFields.ts";
import { RideLogFormFields, useEditRideLogFormProps } from "../../schemas/form/rideLogForm.ts";
import { useRideLogFormFields } from "../../hooks/useRideLogFormFields.tsx";
import { InvalidFormToast } from "../../../../ui/alert/presets/toast";

type EditRideLogFormProps = {
    rideLog: RideLog
    /** Which field will be edited */
    field: RideLogFormFieldsEnum
    onFormStateChange?: (formState: FormState<RideLogFormFields>) => void
}

export function EditRideLogForm({
    rideLog,
    field,
    onFormStateChange
}: EditRideLogFormProps) {
    const { rideLogDao } = useDatabase();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();

    const form = useForm<RideLogFormFields>(useEditRideLogFormProps(rideLog));
    const { fields } = useRideLogFormFields({
        form,
        changeEndTimeWhenInputNotTouched: false
    });
    const editFields: FormFields = fields[field];

    const submitHandler: SubmitHandlerArgs<RideLogFormFields> = {
        onValid: async (formResult) => {
            try {
                await rideLogDao.updateFromFormResult(formResult);

                openToast(editFields.editToastMessages.success());
                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(editFields.editToastMessages.error());
                console.error("Hiba a submitHandler-ben (ride log):", e);
            }
        },
        onInvalid: (errors) => {
            openToast(InvalidFormToast.warning());
            console.log("Edit ride log validation errors", errors);
        }
    };

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