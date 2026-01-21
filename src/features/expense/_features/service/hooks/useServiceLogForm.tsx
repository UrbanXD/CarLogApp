import { UseFormReturn, useWatch } from "react-hook-form";
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
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { Odometer } from "../../../../car/_features/odometer/schemas/odometerSchema.ts";
import { ArrayInput } from "../../../../../components/Input/array/ArrayInput.tsx";
import { useServiceItemToExpandableList } from "./useServiceItemToExpandableList.ts";
import { CurrencyEnum } from "../../../../_shared/currency/enums/currencyEnum.ts";
import { ServiceItemForm } from "../components/forms/ServiceItemForm.tsx";
import { useCar } from "../../../../car/hooks/useCar.ts";
import { useWatchedQueryItem } from "../../../../../database/hooks/useWatchedQueryItem.ts";

type UseServiceLogFormFieldsProps = UseFormReturn<ServiceLogFormFields> & { odometer?: Odometer | null }

export function useServiceLogFormFields(props: UseServiceLogFormFieldsProps) {
    const { control, setValue, clearErrors, odometer } = props;
    const { t } = useTranslation();
    const { odometerLogDao } = useDatabase();
    const { serviceItemToExpandableListItem } = useServiceItemToExpandableList();

    const formOdometerLogId = useWatch({ control, name: "odometerLogId" });
    const formCarId = useWatch({ control, name: "carId" });
    const formDate = useWatch({ control, name: "date" });

    const memoizedLimitQuery = useMemo(() => odometerLogDao.odometerLimitWatchedQueryItem(
        formCarId,
        formDate,
        formOdometerLogId ? [formOdometerLogId] : []
    ), [odometerLogDao, formCarId, formDate, formOdometerLogId]);

    const { car } = useCar({ carId: formCarId, options: { queryOnce: true } });
    const { data: odometerLimit } = useWatchedQueryItem(memoizedLimitQuery);

    useEffect(() => {
        clearErrors();
    }, [formCarId]);

    const fields: Record<ServiceLogFormFieldsEnum, FormFields> = useMemo(() => ({
        [ServiceLogFormFieldsEnum.Car]: {
            render: () => <CarPickerInput control={ control } fieldName="carId"/>,
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
                    fieldName={ "items" }
                    mapperToExpandableList={ serviceItemToExpandableListItem }
                    renderForm={ (onSubmit, item) => (
                        <ServiceItemForm
                            defaultServiceItem={ item }
                            carCurrencyId={ car?.currency.id ?? CurrencyEnum.EUR }
                            onSubmit={ onSubmit }
                        />
                    ) }
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
            render: () => <OdometerValueInput
                control={ control }
                odometerValueFieldName="odometerValue"
                dateFieldName="date"
                currentOdometerValueTranslationKey={
                    odometer
                    ? "odometer.original_value"
                    : "odometer.current_value"
                }
                currentOdometerValue={ odometer?.value ?? car?.odometer.value }
                odometerLimit={ odometerLimit }
                unitText={ car?.odometer.unit.short }
            />,
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
    }), [control, setValue, car, t, odometer, odometerLimit]);

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