import { OdometerLog } from "../../schemas/odometerLogSchema.ts";
import { useForm } from "react-hook-form";
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
import { FormButtons } from "../../../../../../components/Button/presets/FormButtons.tsx";
import { OdometerLogFormFields } from "../../enums/odometerLogFormFields.ts";
import { useOdometerLogFormFields } from "../../hooks/useOdometerLogFormFields.tsx";
import { FormFields } from "../../../../../../types/index.ts";
import Form from "../../../../../../components/Form/Form.tsx";
import { Odometer } from "../../schemas/odometerSchema.ts";
import { InvalidFormToast } from "../../../../../../ui/alert/presets/toast/index.ts";

type EditOdometerLogFormProps = {
    odometerLog: OdometerLog
    /** Which field will be edited, if its undefined that means full form view will appear */
    field?: OdometerLogFormFields
}

export function EditOdometerChangeLogForm({ odometerLog, field }: EditOdometerLogFormProps) {
    const dispatch = useAppDispatch();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();
    const { odometerLogDao } = useDatabase();

    const form = useForm<OdometerChangeLogFormFields>(useEditOdometerChangeLogFormProps(odometerLog));
    const { handleSubmit, reset } = form;

    const { fields, fullForm } = useOdometerLogFormFields({ odometerLog, ...form });
    const editFields: FormFields = fields?.[field] ?? fullForm;

    const submitHandler = handleSubmit(
        async (formResult: OdometerChangeLogFormFields) => {
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
        (errors) => {
            console.log("Edit odometer log validation errors", errors);
            openToast(InvalidFormToast.warning());
        }
    );

    return (
        <Form>
            { editFields.render() }
            <FormButtons reset={ reset } submit={ submitHandler }/>
        </Form>
    );
}