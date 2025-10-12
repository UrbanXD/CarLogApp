import { OdometerLog } from "../../schemas/odometerLogSchema.ts";
import { useForm } from "react-hook-form";
import React from "react";
import { useAppDispatch } from "../../../../../../hooks/index.ts";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { OdometerLogFields, useEditOdometerLogFormProps } from "../../schemas/form/odometerLogForm.ts";
import { updateCarOdometer } from "../../../../model/slice/index.ts";
import { convertOdometerValueFromKilometer } from "../../utils/convertOdometerUnit.ts";
import { FormButtons } from "../../../../../../components/Button/presets/FormButtons.tsx";
import { OdometerLogFormFields } from "../../enums/odometerLogFormFields.ts";
import { useOdometerLogFormFields } from "../../hooks/useOdometerLogFormFields.tsx";
import { FormFields } from "../../../../../../types/index.ts";
import Form from "../../../../../../components/Form/Form.tsx";

type EditOdometerLogFormProps = {
    odometerLog: OdometerLog
    /** Which field will be edited, if its undefined that means full form view will appear */
    field?: OdometerLogFormFields
}

export function EditOdometerLogForm({ odometerLog, field }: EditOdometerLogFormProps) {
    const dispatch = useAppDispatch();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();
    const { odometerLogDao } = useDatabase();

    const form = useForm<OdometerLogFields>(useEditOdometerLogFormProps(odometerLog));
    const { handleSubmit, reset } = form;

    const { fields, fullForm } = useOdometerLogFormFields({ odometerLog, ...form });
    const editFields: FormFields = fields?.[field] ?? fullForm;

    const submitHandler = handleSubmit(
        async (formResult: OdometerLogFields) => {
            try {
                const result = await odometerLogDao.update(formResult);
                const newHighestOdometerValue = await odometerLogDao.getOdometerValueInKmByCarId(result.carId);

                dispatch(updateCarOdometer({
                    carId: result.carId,
                    value: convertOdometerValueFromKilometer(newHighestOdometerValue, result.unit.conversionFactor)
                }));

                openToast(editFields.editToastMessages.success());

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(editFields.editToastMessages.error());
                console.error("Hiba a submitHandler-ben log:", e);
            }
        },
        (errors) => {
            console.log("Edit odometer log validation errors", errors);
            openToast(editFields.editToastMessages.error());
        }
    );

    return (
        <>
            <Form>
                { editFields.render() }
            </Form>
            <FormButtons reset={ reset } submit={ submitHandler }/>
        </>
    );
}