import { UseFormReturn, useWatch } from "react-hook-form";
import { RideLogFormFields } from "../schemas/form/rideLogForm.ts";
import React, { useEffect, useMemo, useState } from "react";
import { Car } from "../../car/schemas/carSchema.ts";
import useCars from "../../car/hooks/useCars.ts";
import { RideLogFormFieldsEnum } from "../enums/RideLogFormFields.ts";
import { FormFields, Steps } from "../../../types/index.ts";
import { CarPickerInput } from "../../car/components/forms/inputFields/CarPickerInput.tsx";
import { RidePlaceInput } from "../_features/place/components/forms/inputFields/RidePlaceInput.tsx";
import { OdometerValueInput } from "../../car/_features/odometer/components/forms/inputFields/OdometerValueInput.tsx";
import Input from "../../../components/Input/Input.ts";
import { NoteInput } from "../../../components/Input/_presets/NoteInput.tsx";
import { RidePassengerInput } from "../_features/passenger/components/forms/inputFields/RidePassengerInput.tsx";
import { RideExpenseInput } from "../_features/rideExpense/components/forms/inputFields/RideExpenseInput.tsx";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { EditToast } from "../../../ui/alert/presets/toast/index.ts";
import { formatWithUnit } from "../../../utils/formatWithUnit.ts";
import { Odometer } from "../../car/_features/odometer/schemas/odometerSchema.ts";
import { OdometerLimit } from "../../car/_features/odometer/model/dao/OdometerLogDao.ts";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";

type UseRideLogFormFieldsProps = {
    form: UseFormReturn<RideLogFormFields>
    setCarOdometerValueWhenInputNotTouched?: boolean
    startOdometer?: Odometer
    endOdometer?: Odometer
}

export function useRideLogFormFields({
    form,
    setCarOdometerValueWhenInputNotTouched = true,
    startOdometer,
    endOdometer
}: UseRideLogFormFieldsProps) {
    const { control, setValue, getFieldState, clearErrors } = form;
    const { t } = useTranslation();
    const { odometerLogDao } = useDatabase();
    const { getCar } = useCars();

    const [car, setCar] = useState<Car | null>(null);
    const [startOdometerLimit, setStartOdometerLimit] = useState<OdometerLimit | null>(null);

    const formCarId = useWatch({ control, name: "carId" });
    const formStartOdometerValue = useWatch({ control, name: "startOdometerValue" });
    const formStartTime = useWatch({ control, name: "startTime" });

    useEffect(() => {
        const car = getCar(formCarId);
        setCar(car ?? null);
        if(car && !getFieldState("startOdometerValue").isDirty && setCarOdometerValueWhenInputNotTouched) {
            setValue("startOdometerValue", car.odometer.value);
        }
        clearErrors();
    }, [formCarId]);

    useEffect(() => {
        if(formStartOdometerValue && !getFieldState("endOdometerValue").isDirty && setCarOdometerValueWhenInputNotTouched) {
            setValue("endOdometerValue", formStartOdometerValue);
        }
    }, [formStartOdometerValue]);

    useEffect(() => {
        (async () => {
            if(!formCarId || !formStartTime) return;

            setStartOdometerLimit(await odometerLogDao.getOdometerLimitByDate(formCarId, formStartTime));
        })();
    }, [formCarId, formStartTime]);

    const fields: Record<RideLogFormFieldsEnum, FormFields> = useMemo(
        () => ({
            [RideLogFormFieldsEnum.Car]: {
                render: () => <CarPickerInput control={ control } fieldName="carId"/>,
                editToastMessages: EditToast
            },
            [RideLogFormFieldsEnum.Expenses]: {
                render: () => <RideExpenseInput
                    control={ control }
                    fieldName="expenses"
                    carIdFieldName="carId"
                    startTimeFieldName="startTime"
                />,
                editToastMessages: EditToast
            },
            [RideLogFormFieldsEnum.Places]: {
                render: () => <RidePlaceInput control={ control } fieldName="places"/>,
                editToastMessages: EditToast
            },
            [RideLogFormFieldsEnum.Passengers]: {
                render: () => <RidePassengerInput control={ control } fieldName="passengers"/>,
                editToastMessages: EditToast
            },
            [RideLogFormFieldsEnum.StartTimeAndOdometer]: {
                render: () => <OdometerValueInput
                    control={ control }
                    odometerValueFieldName="startOdometerValue"
                    odometerValueTitle={ t("rides.start_odometer") }
                    odometerValueSubtitle={ startOdometerLimit && t(
                        "odometer.limit",
                        {
                            value: formatWithUnit(startOdometerLimit.min.value, startOdometerLimit.unitText),
                            date: dayjs(startOdometerLimit.min.date).format("L")
                        }
                    ) }
                    dateFieldName="startTime"
                    dateTitle={ t("rides.start") }
                    unitText={ car?.odometer.unit.short }
                />,
                editToastMessages: EditToast
            },
            [RideLogFormFieldsEnum.EndTimeAndOdometer]: {
                render: () => <OdometerValueInput
                    control={ control }
                    odometerValueFieldName="endOdometerValue"
                    odometerValueTitle={ t("rides.end_odometer") }
                    odometerValueSubtitle={ t(
                        "rides.start_odometer_value",
                        { value: formatWithUnit(formStartOdometerValue, car?.odometer.unit.short) }
                    ) }
                    dateFieldName="endTime"
                    dateTitle={ t("rides.end") }
                    dateSubtitle={ t(
                        "rides.start_time_value",
                        { value: `${ dayjs(formStartTime).format("L LT") }` }
                    ) }
                    unitText={ car?.odometer.unit.short }
                />,
                editToastMessages: EditToast
            },
            [RideLogFormFieldsEnum.DateAndOdometer]: {
                render: () => (
                    <Input.Group>
                        <OdometerValueInput
                            control={ control }
                            odometerValueFieldName="startOdometerValue"
                            odometerValueTitle={ t("rides.start_odometer") }
                            odometerValueSubtitle={ startOdometer && t(
                                "odometer.original_value",
                                { value: formatWithUnit(startOdometer.value, startOdometer.unit.short) }
                            ) }
                            dateFieldName="startTime"
                            dateTitle={ t("rides.start") }
                            currentOdometerValue={ car?.odometer.value }
                            unitText={ car?.odometer.unit.short }
                        />
                        <OdometerValueInput
                            control={ control }
                            odometerValueFieldName="endOdometerValue"
                            odometerValueTitle={ t("rides.end_odometer") }
                            odometerValueSubtitle={ endOdometer && t(
                                "odometer.original_value",
                                { value: formatWithUnit(endOdometer.value, endOdometer.unit.short) }
                            ) }
                            dateFieldName="endTime"
                            dateTitle={ t("rides.end") }
                            unitText={ car?.odometer.unit.short }
                        />
                    </Input.Group>
                ),
                editToastMessages: EditToast
            },
            [RideLogFormFieldsEnum.Note]: {
                render: () => <NoteInput
                    control={ control }
                    setValue={ setValue }
                    fieldName="note"
                />,
                editToastMessages: EditToast
            }
        }),
        [
            control,
            setValue,
            car,
            formStartOdometerValue,
            formStartTime,
            t,
            startOdometer,
            endOdometer,
            startOdometerLimit
        ]
    );

    const multiStepFormSteps: Steps = [
        {
            title: t("rides.steps.car_and_start"),
            fields: ["carId", "startTime", "startOdometerValue"],
            render: () => (
                <Input.Group>
                    { fields[RideLogFormFieldsEnum.Car].render() }
                    { fields[RideLogFormFieldsEnum.StartTimeAndOdometer].render() }
                </Input.Group>
            )
        },
        {
            title: t("rides.route"),
            fields: ["places"],
            render: () => (
                <Input.Group>
                    { fields[RideLogFormFieldsEnum.Places].render() }
                </Input.Group>
            )
        },
        {
            title: t("rides.passengers"),
            fields: ["passengers"],
            render: () => (
                <Input.Group>
                    { fields[RideLogFormFieldsEnum.Passengers].render() }
                </Input.Group>
            )
        },
        {
            title: t("rides.steps.end"),
            fields: ["endTime", "endOdometerValue"],
            render: () => (
                <Input.Group>
                    { fields[RideLogFormFieldsEnum.EndTimeAndOdometer].render() }
                </Input.Group>
            )
        },
        {
            title: t("rides.expenses"),
            fields: ["expenses"],
            render: () => (
                <Input.Group>
                    { fields[RideLogFormFieldsEnum.Expenses].render() }
                </Input.Group>
            )
        },
        {
            title: t("common.note"),
            fields: ["note"],
            render: () => <>{ fields[RideLogFormFieldsEnum.Note].render() }</>
        }
    ];

    return { fields, multiStepFormSteps };
}