import { useAppDispatch, useAppSelector } from "../../../../hooks/index.ts";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useForm } from "react-hook-form";
import { FormFields } from "../../../../types/index.ts";
import React, { useMemo } from "react";
import { Odometer } from "../../../car/_features/odometer/schemas/odometerSchema.ts";
import { updateCarOdometer } from "../../../car/model/slice/index.ts";
import Form from "../../../../components/Form/Form.tsx";
import { FormButtons } from "../../../../components/Button/presets/FormButtons.tsx";
import { RideLog } from "../../schemas/rideLogSchema.ts";
import { RideLogFormFieldsEnum } from "../../enums/RideLogFormFields.ts";
import { RideLogFormFields, useEditRideLogFormProps } from "../../schemas/form/rideLogForm.ts";
import { getUser } from "../../../user/model/selectors/index.ts";
import { useRideLogFormFields } from "../../hooks/useRideLogForm.tsx";

type EditRideLogFormProps = {
    rideLog: RideLog
    /** Which field will be edited */
    field: RideLogFormFieldsEnum
}

export function EditRideLogForm({
    rideLog,
    field
}: EditRideLogFormProps) {
    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);
    const { rideLogDao, odometerLogDao } = useDatabase();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();

    const form = useForm<RideLogFormFields>(useEditRideLogFormProps(rideLog, user?.id));
    const { handleSubmit, reset } = form;

    const { fields } = useRideLogFormFields({ form, setCarOdometerValueWhenInputNotTouched: false });
    const editFields: FormFields = fields[field];

    const submitHandler = useMemo(() => handleSubmit(
        async (formResult: RideLogFormFields) => {
            try {
                const result = await rideLogDao.update(formResult);

                let newCarOdometer: Odometer | null = null;
                let oldCarOdometer: Odometer | null = null;

                if(result) {
                    newCarOdometer = await odometerLogDao.getOdometerByCarId(result.carId);

                    if(result.carId !== rideLog.carId) oldCarOdometer = await odometerLogDao.getOdometerByCarId(rideLog.carId);
                }

                if(newCarOdometer) dispatch(updateCarOdometer({ odometer: newCarOdometer }));
                if(oldCarOdometer) dispatch(updateCarOdometer({ odometer: oldCarOdometer }));

                openToast(editFields.editToastMessages.success());

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(editFields.editToastMessages.error());
                console.error("Hiba a submitHandler-ben (ride log):", e);
            }
        },
        (errors) => {
            openToast(editFields.editToastMessages.error());
            console.log("Edit ride log validation errors", errors);
        }
    ), [handleSubmit, editFields]);

    return (
        <Form>
            { editFields.render() }
            <FormButtons reset={ reset } submit={ submitHandler }/>
        </Form>
    );
}