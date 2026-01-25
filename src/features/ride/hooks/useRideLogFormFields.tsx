import { UseFormReturn, useWatch } from "react-hook-form";
import { RideLogFormFields } from "../schemas/form/rideLogForm.ts";
import React, { useEffect, useMemo } from "react";
import { RideLogFormFieldsEnum } from "../enums/RideLogFormFields.ts";
import { FormFields, Steps } from "../../../types";
import { CarPickerInput } from "../../car/components/forms/inputFields/CarPickerInput.tsx";
import { OdometerValueInput } from "../../car/_features/odometer/components/forms/inputFields/OdometerValueInput.tsx";
import Input from "../../../components/Input/Input.ts";
import { NoteInput } from "../../../components/Input/_presets/NoteInput.tsx";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { EditToast } from "../../../ui/alert/presets/toast";
import { useRidePlaceToExpandableList } from "../_features/place/hooks/useRidePlaceToExpandableList.ts";
import { ArrayInput } from "../../../components/Input/array/ArrayInput.tsx";
import { RidePlaceForm } from "../_features/place/components/forms/RidePlaceForm.tsx";
import { useRidePassengerToExpandableList } from "../_features/passenger/hooks/useRidePassengerToExpandableList.ts";
import { RidePassengerForm } from "../_features/passenger/components/forms/RidePassengerForm.tsx";
import { useRideExpenseToExpandableList } from "../_features/rideExpense/hooks/useRideExpenseToExpandableList.ts";
import { RideExpenseForm } from "../_features/rideExpense/components/forms/RideExpenseForm.tsx";
import { useCar } from "../../car/hooks/useCar.ts";

type UseRideLogFormFieldsProps = {
    form: UseFormReturn<RideLogFormFields>
    changeEndTimeWhenInputNotTouched?: boolean
}

export function useRideLogFormFields({
    form,
    changeEndTimeWhenInputNotTouched = true
}: UseRideLogFormFieldsProps) {
    const { control, setValue, getFieldState, clearErrors } = form;
    const { t } = useTranslation();
    const { ridePlaceToExpandableList } = useRidePlaceToExpandableList();
    const { ridePassengerToExpandableList } = useRidePassengerToExpandableList();
    const { rideExpenseToExpandableList } = useRideExpenseToExpandableList();

    const formCarId = useWatch({ control, name: "carId" });
    const formStartOdometerValue = useWatch({ control, name: "startOdometerValue" });
    const formStartTime = useWatch({ control, name: "startTime" });

    const { car } = useCar({ carId: formCarId, options: { queryOnce: true } });

    useEffect(() => {
        clearErrors();
    }, [formCarId]);

    useEffect(() => {
        if(changeEndTimeWhenInputNotTouched && formStartTime && !getFieldState("endTime").isDirty) {
            setValue("endTime", formStartTime);
        }
    }, [formStartTime, changeEndTimeWhenInputNotTouched]);

    const fields: Record<RideLogFormFieldsEnum, FormFields> = useMemo(
        () => ({
            [RideLogFormFieldsEnum.Car]: {
                render: () => <CarPickerInput control={ control } fieldName="carId"/>,
                editToastMessages: EditToast
            },
            [RideLogFormFieldsEnum.Expenses]: {
                render: () => (
                    <ArrayInput<RideLogFormFields, "expenses">
                        control={ control }
                        fieldName="expenses"
                        title={ t("rides.other_expenses") }
                        mapperToExpandableList={ rideExpenseToExpandableList }
                        renderForm={
                            (onSubmit, item) => {
                                if(!car) return null;

                                return (
                                    <RideExpenseForm
                                        car={ car }
                                        defaultRideExpense={ item ?? undefined }
                                        defaultDate={ formStartTime }
                                        onSubmit={ onSubmit }
                                    />
                                );
                            }
                        }
                        calculateItemAmount={ (item) => item.expense.amount }
                        showTotalAmounts
                    />
                ),
                editToastMessages: EditToast
            },
            [RideLogFormFieldsEnum.Places]: {
                render: () => (
                    <ArrayInput<RideLogFormFields, "places">
                        control={ control }
                        fieldName="places"
                        title={ t("places.title") }
                        mapperToExpandableList={ ridePlaceToExpandableList }
                        renderForm={
                            (onSubmit, item) => (
                                <RidePlaceForm
                                    onSubmit={ onSubmit }
                                    defaultRidePlace={ item }
                                />
                            )
                        }
                    />
                ),
                editToastMessages: EditToast
            },
            [RideLogFormFieldsEnum.Passengers]: {
                render: () => (
                    <ArrayInput<RideLogFormFields, "passengers">
                        control={ control }
                        fieldName="passengers"
                        title={ t("passengers.title") }
                        mapperToExpandableList={ ridePassengerToExpandableList }
                        renderForm={
                            (onSubmit, item) => (
                                <RidePassengerForm
                                    onSubmit={ onSubmit }
                                    defaultRidePassenger={ item }
                                />
                            )
                        }
                        checkItemAlreadyAdded
                        alreadyAddedItemExpression={ (itemA, itemB) => itemA.passengerId === itemB.passengerId }
                    />
                ),
                editToastMessages: EditToast
            },
            [RideLogFormFieldsEnum.StartTimeAndOdometer]: {
                render: () => <OdometerValueInput
                    control={ control }
                    setValue={ setValue }
                    getFieldState={ getFieldState }
                    idFieldName="startOdometerLogId"
                    carIdFieldName="carId"
                    odometerValueFieldName="startOdometerValue"
                    odometerValueTitle={ t("rides.start_odometer") }
                    dateFieldName="startTime"
                    dateTitle={ t("rides.start") }
                    changeCarOdometerValueWhenInputNotTouched={ true }
                />,
                editToastMessages: EditToast
            },
            [RideLogFormFieldsEnum.EndTimeAndOdometer]: {
                render: () => <OdometerValueInput
                    control={ control }
                    setValue={ setValue }
                    getFieldState={ getFieldState }
                    idFieldName="endOdometerLogId"
                    carIdFieldName="carId"
                    odometerValueFieldName="endOdometerValue"
                    odometerValueTitle={ t("rides.end_odometer") }
                    currentOdometerValue={ formStartOdometerValue }
                    currentOdometerValueTranslationKey="rides.start_odometer_value"
                    showLimits={ false }
                    dateFieldName="endTime"
                    dateTitle={ t("rides.end") }
                    dateSubtitle={ t(
                        "rides.start_time_value",
                        { value: `${ dayjs(formStartTime).format("L LT") }` }
                    ) }
                    changeCarOdometerValueWhenInputNotTouched={ false }
                />,
                editToastMessages: EditToast
            },
            [RideLogFormFieldsEnum.DateAndOdometer]: {
                render: () => (
                    <Input.Group>
                        <OdometerValueInput
                            control={ control }
                            setValue={ setValue }
                            getFieldState={ getFieldState }
                            idFieldName="startOdometerLogId"
                            carIdFieldName="carId"
                            odometerValueFieldName="startOdometerValue"
                            odometerValueTitle={ t("rides.start_odometer") }
                            dateFieldName="startTime"
                            dateTitle={ t("rides.start") }
                            showLimits={ true }
                            changeCarOdometerValueWhenInputNotTouched={ false }
                        />
                        <OdometerValueInput
                            control={ control }
                            setValue={ setValue }
                            getFieldState={ getFieldState }
                            idFieldName="endOdometerLogId"
                            carIdFieldName="carId"
                            odometerValueFieldName="endOdometerValue"
                            odometerValueTitle={ t("rides.end_odometer") }
                            dateFieldName="endTime"
                            dateTitle={ t("rides.end") }
                            showCurrentOdometerValueAsSubtitle={ false }
                            showLimits={ false }
                            changeCarOdometerValueWhenInputNotTouched={ false }
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
            getFieldState,
            formStartOdometerValue,
            formStartTime,
            t,
            car
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