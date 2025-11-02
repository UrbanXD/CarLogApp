import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useForm } from "react-hook-form";
import { FormFields } from "../../../../../../types/index.ts";
import React, { useMemo } from "react";
import Form from "../../../../../../components/Form/Form.tsx";
import { FormButtons } from "../../../../../../components/Button/presets/FormButtons.tsx";
import { updateCarOdometer } from "../../../../../car/model/slice/index.ts";
import { Odometer } from "../../../../../car/_features/odometer/schemas/odometerSchema.ts";
import { useAppDispatch } from "../../../../../../hooks/index.ts";
import { ServiceLogFormFieldsEnum } from "../../enums/ServiceLogFormFieldsEnum.ts";
import { ServiceLog } from "../../schemas/serviceLogSchema.ts";
import { ServiceLogFields, useEditServiceLogFormProps } from "../../schemas/form/serviceLogForm.ts";
import { useServiceLogFormFields } from "../../hooks/useServiceLogForm.tsx";

type EditServiceLogFormProps = {
    serviceLog: ServiceLog
    /** Which field will be edited */
    field: ServiceLogFormFieldsEnum
}

export function EditServiceLogForm({
    serviceLog,
    field
}: EditServiceLogFormProps) {
    const dispatch = useAppDispatch();
    const { serviceLogDao, odometerLogDao } = useDatabase();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();

    const form = useForm<ServiceLogFields>(useEditServiceLogFormProps(serviceLog));
    const { handleSubmit, reset } = form;

    const { fields } = useServiceLogFormFields(form);
    const editFields: FormFields = fields[field];

    const submitHandler = useMemo(() => handleSubmit(
        async (formResult: ServiceLogFields) => {
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
        (errors) => {
            openToast(editFields.editToastMessages.error());
            console.log("Edit fuel log validation errors", errors);
        }
    ), [handleSubmit, editFields]);

    return (
        <Form>
            { editFields.render() }
            <FormButtons reset={ reset } submit={ submitHandler }/>
        </Form>
    );
}