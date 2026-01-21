import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { FormState, useForm } from "react-hook-form";
import { FormFields, SubmitHandlerArgs } from "../../../../../../types";
import React from "react";
import Form from "../../../../../../components/Form/Form.tsx";
import { FuelLog } from "../../schemas/fuelLogSchema.ts";
import { FuelLogFormFieldsEnum } from "../../enums/fuelLogFormFields.tsx";
import { FuelLogFormFields, useEditFuelLogFormProps } from "../../schemas/form/fuelLogForm.ts";
import { useFuelLogFormFields } from "../../hooks/useFuelLogForm.tsx";
import { InvalidFormToast } from "../../../../../../ui/alert/presets/toast";

type EditFuelLogFormProps = {
    fuelLog: FuelLog
    /** Which field will be edited, if its undefined that means full form view will appear */
    field: FuelLogFormFieldsEnum
    onFormStateChange?: (formState: FormState<FuelLogFormFields>) => void
}

export function EditFuelLogForm({
    fuelLog,
    field,
    onFormStateChange
}: EditFuelLogFormProps) {
    const { fuelLogDao } = useDatabase();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();

    const form = useForm<FuelLogFormFields, any, FuelLogFormFields>(useEditFuelLogFormProps(fuelLog));
    const { fields } = useFuelLogFormFields({ form, odometer: fuelLog.odometer });
    const editFields: FormFields = fields[field];

    const submitHandler: SubmitHandlerArgs<FuelLogFormFields> = {
        onValid: async (formResult) => {
            try {
                await fuelLogDao.updateFromFormResult(formResult);

                openToast(editFields.editToastMessages.success());
                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(editFields.editToastMessages.error());
                console.error("Hiba a submitHandler-ben:", e);
            }
        },
        onInvalid: (errors) => {
            openToast(InvalidFormToast.warning());
            console.log("Edit fuel log validation errors", errors);
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