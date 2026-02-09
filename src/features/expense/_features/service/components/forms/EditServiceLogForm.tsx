import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { FormState, useForm } from "react-hook-form";
import { FormFields, SubmitHandlerArgs } from "../../../../../../types";
import React from "react";
import Form from "../../../../../../components/Form/Form.tsx";
import { ServiceLogFormFieldsEnum } from "../../enums/ServiceLogFormFieldsEnum.ts";
import { ServiceLog } from "../../schemas/serviceLogSchema.ts";
import { ServiceLogFormFields, useEditServiceLogFormProps } from "../../schemas/form/serviceLogForm.ts";
import { useServiceLogFormFields } from "../../hooks/useServiceLogForm.tsx";
import { InvalidFormToast } from "../../../../../../ui/alert/presets/toast";

type EditServiceLogFormProps = {
    serviceLog: ServiceLog
    /** Which field will be edited */
    field: ServiceLogFormFieldsEnum
    onFormStateChange?: (formState: FormState<ServiceLogFormFields>) => void
}

export function EditServiceLogForm({
    serviceLog,
    field,
    onFormStateChange
}: EditServiceLogFormProps) {
    const { serviceLogDao } = useDatabase();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();

    const form = useForm<ServiceLogFormFields>(useEditServiceLogFormProps(serviceLog));
    const { fields } = useServiceLogFormFields({ form, isEdit: true });
    const editFields: FormFields = fields[field];

    const submitHandler: SubmitHandlerArgs<ServiceLogFormFields> = {
        onValid: async (formResult) => {
            try {
                await serviceLogDao.updateFromFormResult(formResult);

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