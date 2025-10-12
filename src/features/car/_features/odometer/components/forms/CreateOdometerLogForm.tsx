import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../../../../../hooks/index.ts";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { OdometerLogFields, useCreateOdometerLogFormProps } from "../../schemas/form/odometerLogForm.ts";
import { updateCarOdometer } from "../../../../model/slice/index.ts";
import { CarCreateToast } from "../../../../presets/toast/index.ts";
import { useForm, useWatch } from "react-hook-form";
import useCars from "../../../../hooks/useCars.ts";
import { Car } from "../../../../schemas/carSchema.ts";
import { useOdometerLogFormFields } from "../../hooks/useOdometerLogFormFields.tsx";
import Form from "../../../../../../components/Form/Form.tsx";
import { FormButtons } from "../../../../../../components/Button/presets/FormButtons.tsx";

type CreateOdometerLogFormProps = {
    defaultCarId?: string
}

export function CreateOdometerLogForm({ defaultCarId }: CreateOdometerLogFormProps) {
    const dispatch = useAppDispatch();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();
    const { odometerLogDao } = useDatabase();
    const { selectedCar, getCar } = useCars();

    const [car, setCar] = useState<Car | null>(defaultCarId ? getCar(defaultCarId) ?? selectedCar : selectedCar);

    const form = useForm<OdometerLogFields>(useCreateOdometerLogFormProps(car));
    const { control, setValue, handleSubmit, clearErrors, getFieldState } = form;
    const { fullForm } = useOdometerLogFormFields({ ...form, defaultCarId });

    const formCarId = useWatch({ control, name: "carId" });

    useEffect(() => {
        const car = getCar(formCarId);
        setCar(car ?? null);
        setValue("conversionFactor", car?.odometer.unit.conversionFactor ?? 1);
        clearErrors();
    }, [formCarId]);

    useEffect(() => {
        if(car && !getFieldState("value").isDirty) {
            setValue("value", car.odometer.value ?? 0);
        }
    }, [car?.odometer.value]);

    const submitHandler = handleSubmit(
        async (formResult: OdometerLogFields) => {
            try {
                const result = await odometerLogDao.create(formResult);
                dispatch(updateCarOdometer({ carId: result.carId, value: result.value }));

                openToast(CarCreateToast.success());

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(CarCreateToast.error());
                console.error("Hiba a submitHandler-ben log:", e);
            }
        },
        (errors) => {
            console.log("Create odometer log validation errors", errors);
            openToast(CarCreateToast.error());
        }
    );

    return (
        <>
            <Form>
                { fullForm.render() }
            </Form>
            <FormButtons submit={ submitHandler } submitText={ "Rögzítés" }/>
        </>
    );
}