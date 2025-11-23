import { UseFormReturn, useWatch } from "react-hook-form";
import useCars from "../../../../car/hooks/useCars.ts";
import React, { useEffect, useMemo, useState } from "react";
import { Car } from "../../../../car/schemas/carSchema.ts";
import { FormFields, Steps } from "../../../../../types/index.ts";
import { CarPickerInput } from "../../../../car/components/forms/inputFields/CarPickerInput.tsx";
import Input from "../../../../../components/Input/Input.ts";
import InputDatePicker from "../../../../../components/Input/datePicker/InputDatePicker.tsx";
import {
    OdometerValueInput
} from "../../../../car/_features/odometer/components/forms/inputFields/OdometerValueInput.tsx";
import { NoteInput } from "../../../../../components/Input/_presets/NoteInput.tsx";
import { ServiceLogFields } from "../schemas/form/serviceLogForm.ts";
import { ServiceLogFormFieldsEnum } from "../enums/ServiceLogFormFieldsEnum.ts";
import { ServiceTypeInput } from "../components/forms/inputFields/ServiceTypeInput.tsx";
import { ServiceItemInput } from "../components/forms/inputFields/ServiceItemInput.tsx";
import { useTranslation } from "react-i18next";
import { EditToast } from "../../../../../ui/alert/presets/toast/EditToast.ts";

type UseServiceLogFormFieldsProps = UseFormReturn<ServiceLogFields>

export function useServiceLogFormFields(props: UseServiceLogFormFieldsProps) {
    const { control, setValue, clearErrors } = props;
    const { t } = useTranslation();
    const { getCar } = useCars();

    const [car, setCar] = useState<Car | null>(null);

    const formCarId = useWatch({ control, name: "carId" });

    useEffect(() => {
        const car = getCar(formCarId);
        setCar(car ?? null);
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
            render: () => <ServiceItemInput control={ control } fieldName="items" carIdFieldName="carId"/>,
            editToastMessages: EditToast
        },
        [ServiceLogFormFieldsEnum.Date]: {
            render: () => (
                <Input.Field
                    control={ control }
                    fieldName="date"
                    fieldNameText={ t("date.text") }
                >
                    <InputDatePicker/>
                </Input.Field>
            ),
            editToastMessages: EditToast
        },
        [ServiceLogFormFieldsEnum.OdometerValue]: {
            render: () => <OdometerValueInput
                control={ control }
                fieldName="odometerValue"
                currentOdometerValue={ car?.odometer.value }
                unitText={ car?.odometer.unit.short }
                optional
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
    }), [control, setValue, car, t]);

    const multiStepFormSteps: Steps = [
        {
            title: t("service.steps.basic_information"),
            fields: ["carId", "date", "odometerValue", "note"],
            render: () => (
                <Input.Group>
                    { fields[ServiceLogFormFieldsEnum.Car].render() }
                    { fields[ServiceLogFormFieldsEnum.Date].render() }
                    { fields[ServiceLogFormFieldsEnum.OdometerValue].render() }
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