import { OdometerLog } from "../../schemas/odometerLogSchema.ts";
import { FormState, useForm } from "react-hook-form";
import React from "react";
import { useAppDispatch } from "../../../../../../hooks/index.ts";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import {
    OdometerChangeLogFormFields,
    useEditOdometerChangeLogFormProps
} from "../../schemas/form/odometerChangeLogForm.ts";
import { updateCarOdometer } from "../../../../model/slice/index.ts";
import { OdometerLogFormFields } from "../../enums/odometerLogFormFields.ts";
import { useOdometerLogFormFields } from "../../hooks/useOdometerLogFormFields.tsx";
import { FormFields, SubmitHandlerArgs } from "../../../../../../types/index.ts";
import Form from "../../../../../../components/Form/Form.tsx";
import { Odometer } from "../../schemas/odometerSchema.ts";
import { InvalidFormToast } from "../../../../../../ui/alert/presets/toast/index.ts";

type EditOdometerLogFormProps = {
    odometerLog: OdometerLog
    /** Which field will be edited, if its undefined that means full form view will appear */
    field?: OdometerLogFormFields
    onFormStateChange?: (formState: FormState<OdometerChangeLogFormFields>) => void
}

export function EditOdometerChangeLogForm({ odometerLog, field, onFormStateChange }: EditOdometerLogFormProps) {
    const dispatch = useAppDispatch();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();
    const { odometerLogDao } = useDatabase();

    const form = useForm<OdometerChangeLogFormFields>(useEditOdometerChangeLogFormProps(odometerLog));
    const { fields, fullForm } = useOdometerLogFormFields({ odometerLog, ...form });
    const editFields: FormFields = fields?.[field] ?? fullForm;

    const submitHandler: SubmitHandlerArgs<OdometerChangeLogFormFields> = {
        onValid: async (formResult) => {
            try {
                const result = await odometerLogDao.updateOdometerChangeLog(formResult);

                const newCarOdometer = await odometerLogDao.getOdometerByCarId(result.carId);

                let oldCarOdometer: Odometer | null = null;
                if(newCarOdometer.carId !== odometerLog.carId) {
                    oldCarOdometer = await odometerLogDao.getOdometerByCarId(odometerLog.carId);
                }

                dispatch(updateCarOdometer({ odometer: newCarOdometer }));
                if(oldCarOdometer) dispatch(updateCarOdometer({ odometer: oldCarOdometer }));

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