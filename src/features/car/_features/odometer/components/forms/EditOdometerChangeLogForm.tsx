import { OdometerLog } from "../../schemas/odometerLogSchema.ts";
import { FormState, useForm } from "react-hook-form";
import React from "react";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import {
    OdometerChangeLogFormFields,
    useEditOdometerChangeLogFormProps
} from "../../schemas/form/odometerChangeLogForm.ts";
import { OdometerLogFormFieldsEnum } from "../../enums/odometerLogFormFields.ts";
import { useOdometerLogFormFields } from "../../hooks/useOdometerLogFormFields.tsx";
import { FormFields, SubmitHandlerArgs } from "../../../../../../types";
import Form from "../../../../../../components/Form/Form.tsx";
import { InvalidFormToast } from "../../../../../../ui/alert/presets/toast";

type EditOdometerLogFormProps = {
    odometerLog: OdometerLog
    /** Which field will be edited, if its undefined that means full form view will appear */
    field?: OdometerLogFormFieldsEnum
    onFormStateChange?: (formState: FormState<OdometerChangeLogFormFields>) => void
}

export function EditOdometerChangeLogForm({ odometerLog, field, onFormStateChange }: EditOdometerLogFormProps) {
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();
    const { odometerLogDao } = useDatabase();

    const form = useForm<OdometerChangeLogFormFields>(useEditOdometerChangeLogFormProps(odometerLog));
    const { fields, fullForm } = useOdometerLogFormFields({ form, isEdit: true });
    const editFields: FormFields = field !== undefined ? fields?.[field] ?? fullForm : fullForm;

    const submitHandler: SubmitHandlerArgs<OdometerChangeLogFormFields> = {
        onValid: async (formResult) => {
            try {
                await odometerLogDao.updateOdometerChangeLog(formResult);

                openToast(editFields.editToastMessages.success());
                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(editFields.editToastMessages.error());
                console.error("Hiba a submitHandler-ben log:", e);
            }
        },
        onInvalid: (errors) => {
            console.log("Edit odometer log validation errors", errors);
            openToast(InvalidFormToast.warning());
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