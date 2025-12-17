import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { FormState, useForm } from "react-hook-form";
import { FormFields, SubmitHandlerArgs } from "../../../../../../types/index.ts";
import React from "react";
import Form from "../../../../../../components/Form/Form.tsx";
import { updateCarOdometer } from "../../../../../car/model/slice/index.ts";
import { Odometer } from "../../../../../car/_features/odometer/schemas/odometerSchema.ts";
import { useAppDispatch } from "../../../../../../hooks/index.ts";
import { ServiceLogFormFieldsEnum } from "../../enums/ServiceLogFormFieldsEnum.ts";
import { ServiceLog } from "../../schemas/serviceLogSchema.ts";
import { ServiceLogFields, useEditServiceLogFormProps } from "../../schemas/form/serviceLogForm.ts";
import { useServiceLogFormFields } from "../../hooks/useServiceLogForm.tsx";
import { InvalidFormToast } from "../../../../../../ui/alert/presets/toast/index.ts";

type EditServiceLogFormProps = {
    serviceLog: ServiceLog
    /** Which field will be edited */
    field: ServiceLogFormFieldsEnum
    onFormStateChange?: (formState: FormState<ServiceLogFields>) => void
}

export function EditServiceLogForm({
    serviceLog,
    field,
    onFormStateChange
}: EditServiceLogFormProps) {
    const dispatch = useAppDispatch();
    const { serviceLogDao, odometerLogDao } = useDatabase();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();

    const form = useForm<ServiceLogFields>(useEditServiceLogFormProps(serviceLog));
    const { fields } = useServiceLogFormFields({ ...form, odometer: serviceLog.odometer });
    const editFields: FormFields = fields[field];

    const submitHandler: SubmitHandlerArgs<ServiceLogFields> = {
        onValid: async (formResult) => {
            try {
                const result = await serviceLogDao.update(formResult);

                let newCarOdometer: Odometer | null = null;
                let oldCarOdometer: Odometer | null = null;

                if(result?.odometer) newCarOdometer = await odometerLogDao.getOdometerByCarId(result.odometer.carId);
                if(serviceLog?.odometer && result?.odometer?.carId !== serviceLog.odometer.carId) {
                    oldCarOdometer = await odometerLogDao.getOdometerByCarId(serviceLog.odometer.carId);
                }

                if(newCarOdometer) dispatch(updateCarOdometer({ odometer: newCarOdometer }));
                if(oldCarOdometer) dispatch(updateCarOdometer({ odometer: oldCarOdometer }));

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