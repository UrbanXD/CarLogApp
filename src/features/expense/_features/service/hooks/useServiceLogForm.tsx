import { UseFormReturn, useWatch } from "react-hook-form";
import useCars from "../../../../car/hooks/useCars.ts";
import React, { useEffect, useMemo, useState } from "react";
import { Car } from "../../../../car/schemas/carSchema.ts";
import { FormFields, Steps } from "../../../../../types/index.ts";
import { CarPickerInput } from "../../../../car/components/forms/inputFields/CarPickerInput.tsx";
import Input from "../../../../../components/Input/Input.ts";
import {
    OdometerValueInput
} from "../../../../car/_features/odometer/components/forms/inputFields/OdometerValueInput.tsx";
import { NoteInput } from "../../../../../components/Input/_presets/NoteInput.tsx";
import { ServiceLogFields } from "../schemas/form/serviceLogForm.ts";
import { ServiceLogFormFieldsEnum } from "../enums/ServiceLogFormFieldsEnum.ts";
import { ServiceTypeInput } from "../components/forms/inputFields/ServiceTypeInput.tsx";
import { ServiceItemInput } from "../components/forms/inputFields/ServiceItemInput.tsx";
import { useTranslation } from "react-i18next";
import { EditToast } from "../../../../../ui/alert/presets/toast/index.ts";
import { formatWithUnit } from "../../../../../utils/formatWithUnit.ts";
import { OdometerLimit } from "../../../../car/_features/odometer/model/dao/OdometerLogDao.ts";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import dayjs from "dayjs";
import { Odometer } from "../../../../car/_features/odometer/schemas/odometerSchema.ts";

type UseServiceLogFormFieldsProps = UseFormReturn<ServiceLogFields> & { odometer?: Odometer }

export function useServiceLogFormFields(props: UseServiceLogFormFieldsProps) {
    const { control, setValue, clearErrors, odometer } = props;
    const { t } = useTranslation();
    const { odometerLogDao } = useDatabase();
    const { getCar } = useCars();

    const [car, setCar] = useState<Car | null>(null);
    const [odometerLimit, setOdometerLimit] = useState<OdometerLimit | null>(null);

    const formCarId = useWatch({ control, name: "carId" });
    const formDate = useWatch({ control, name: "date" });

    useEffect(() => {
        const car = getCar(formCarId);
        setCar(car ?? null);
        clearErrors();
    }, [formCarId]);

    useEffect(() => {
        (async () => {
            if(!formCarId || !formDate) return;

            setOdometerLimit(await odometerLogDao.getOdometerLimitByDate(formCarId, formDate));
        })();
    }, [formCarId, formDate]);

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
        [ServiceLogFormFieldsEnum.DateAndOdometerValue]: {
            render: () => <OdometerValueInput
                control={ control }
                odometerValueFieldName="odometerValue"
                dateFieldName="date"
                odometerValueSubtitle={ odometer ? t(
                    "odometer.original_value",
                    { value: formatWithUnit(odometer.value, odometer.unit.short) }
                ) : odometerLimit && t(
                    "odometer.limit",
                    {
                        value: formatWithUnit(odometerLimit.min.value, odometerLimit.unitText),
                        date: dayjs(odometerLimit.min.date).format("L")
                    }
                ) }
                currentOdometerValue={ car?.odometer.value }
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