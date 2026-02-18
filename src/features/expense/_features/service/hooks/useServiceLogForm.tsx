import { UseFormReturn, useFormState, useWatch } from "react-hook-form";
import React, { useEffect, useMemo } from "react";
import { FormFields, Steps } from "../../../../../types";
import { CarPickerInput } from "../../../../car/components/forms/inputFields/CarPickerInput.tsx";
import Input from "../../../../../components/Input/Input.ts";
import {
    OdometerValueInput
} from "../../../../car/_features/odometer/components/forms/inputFields/OdometerValueInput.tsx";
import { NoteInput } from "../../../../../components/Input/_presets/NoteInput.tsx";
import { ServiceLogFormFields } from "../schemas/form/serviceLogForm.ts";
import { ServiceLogFormFieldsEnum } from "../enums/ServiceLogFormFieldsEnum.ts";
import { ServiceTypeInput } from "../components/forms/inputFields/ServiceTypeInput.tsx";
import { useTranslation } from "react-i18next";
import { EditToast } from "../../../../../ui/alert/presets/toast";
import { ArrayInput } from "../../../../../components/Input/array/ArrayInput.tsx";
import { useServiceItemToExpandableList } from "./useServiceItemToExpandableList.ts";
import { ServiceItemForm } from "../components/forms/ServiceItemForm.tsx";
import { useCar } from "../../../../car/hooks/useCar.ts";

type UseServiceLogFormFieldsProps = {
    form: UseFormReturn<ServiceLogFormFields>
    isEdit?: boolean
}

export function useServiceLogFormFields({ form, isEdit }: UseServiceLogFormFieldsProps) {
    const { control, setValue, getFieldState, clearErrors } = form;
    const { t } = useTranslation();
    const { serviceItemToExpandableListItem } = useServiceItemToExpandableList();

    const formCarId = useWatch({ control, name: "carId" });

    const { car } = useCar({ carId: formCarId, options: { queryOnce: true } });

    useEffect(() => {
        clearErrors();
    }, [formCarId]);

    const odometerValueInput = useMemo(() => (
        <OdometerValueInput
            control={ control }
            setValue={ setValue }
            getFieldState={ getFieldState }
            idFieldName="odometerLogId"
            odometerValueFieldName="odometerValue"
            carIdFieldName="carId"
            dateFieldName="date"
            changeCarOdometerValueWhenInputNotTouched={ !isEdit }
        />
    ), [control, setValue, getFieldState, isEdit]);

    const fields: Record<ServiceLogFormFieldsEnum, FormFields> = useMemo(() => ({
        [ServiceLogFormFieldsEnum.Car]: {
            render: () => <CarPickerInput control={ control } fieldName="carId"/>,
            editToastMessages: EditToast
        },
        [ServiceLogFormFieldsEnum.CarWithDateAndOdometerValue]: {
            render: () => {
                const { errors, dirtyFields } = useFormState({ control });

                const showDateAndOdometerValueInput = !!(
                    errors.date ||
                    errors.odometerValue ||
                    dirtyFields.date ||
                    dirtyFields.odometerValue
                );

                return (
                    <Input.Group>
                        <CarPickerInput control={ control } fieldName="carId"/>
                        { showDateAndOdometerValueInput && odometerValueInput }
                    </Input.Group>
                );
            },
            editToastMessages: EditToast
        },
        [ServiceLogFormFieldsEnum.Type]: {
            render: () => <ServiceTypeInput control={ control } fieldName="serviceTypeId"/>,
            editToastMessages: EditToast
        },
        [ServiceLogFormFieldsEnum.ServiceItems]: {
            render: () => (
                <ArrayInput<ServiceLogFormFields, "items">
                    control={ control }
                    fieldName="items"
                    mapperToExpandableList={ serviceItemToExpandableListItem }
                    renderForm={
                        (onSubmit, item) => {
                            if(!car) return null;

                            return (
                                <ServiceItemForm
                                    defaultServiceItem={ item }
                                    carCurrency={ car.currency }
                                    onSubmit={ onSubmit }
                                />
                            );
                        }
                    }
                    showTotalAmounts
                    calculateItemAmount={ (item) => ({
                        amount: item.quantity * item.pricePerUnit.amount,
                        exchangedAmount: item.quantity * item.pricePerUnit.amount * item.pricePerUnit.exchangeRate,
                        currency: item.pricePerUnit.currency,
                        exchangeCurrency: item.pricePerUnit.exchangeCurrency
                    }) }
                />
            ),
            editToastMessages: EditToast
        },
        [ServiceLogFormFieldsEnum.DateAndOdometerValue]: {
            render: () => odometerValueInput,
            editToastMessages: EditToast
        },
        [ServiceLogFormFieldsEnum.Note]: {
            render: () => <NoteInput
                control={ control }
                setValue={ setValue }
                fieldName="note"
            />,
            editToastMessages: EditToast
        }
    }), [control, setValue, getFieldState, car, t, isEdit, odometerValueInput]);

    const multiStepFormSteps: Steps = [
        {
            title: t("service.steps.basic_information"),
            fields: ["carId", "date", "odometerValue", "note"],
            render: () => (
                <Input.Group>
                    { fields[ServiceLogFormFieldsEnum.Car].render() }
                    { fields[ServiceLogFormFieldsEnum.DateAndOdometerValue].render() }
                    { fields[ServiceLogFormFieldsEnum.Note].render() }
                </Input.Group>
            )
        },
        {
            title: t("service.steps.items"),
            fields: ["items", "serviceTypeId"],
            render: () => (
                <Input.Group>
                    { fields[ServiceLogFormFieldsEnum.Type].render() }
                    { fields[ServiceLogFormFieldsEnum.ServiceItems].render() }
                </Input.Group>
            )
        }
    ];

    return { fields, multiStepFormSteps };
}