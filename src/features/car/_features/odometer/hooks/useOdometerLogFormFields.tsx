import { UseFormReturn, useWatch } from "react-hook-form";
import React, { useEffect, useMemo } from "react";
import { FormFields } from "../../../../../types";
import { CarPickerInput } from "../../../components/forms/inputFields/CarPickerInput.tsx";
import { NoteInput } from "../../../../../components/Input/_presets/NoteInput.tsx";
import { OdometerLogFormFields } from "../enums/odometerLogFormFields.ts";
import { OdometerValueInput } from "../components/forms/inputFields/OdometerValueInput.tsx";
import { OdometerChangeLogFormFields } from "../schemas/form/odometerChangeLogForm.ts";
import { EditToast } from "../../../../../ui/alert/presets/toast";
import { useTranslation } from "react-i18next";

type UseOdometerLogFormFieldsProps = {
    form: UseFormReturn<OdometerChangeLogFormFields>
    isEdit?: boolean
}

export function useOdometerLogFormFields({ form, isEdit }: UseOdometerLogFormFieldsProps) {
    const { control, setValue, clearErrors, getFieldState } = form;
    const { t } = useTranslation();

    const formCarId = useWatch({ control, name: "carId" });

    useEffect(() => {
        clearErrors();
    }, [formCarId]);

    const fields: Record<OdometerLogFormFields, FormFields> = useMemo(() => ({
        [OdometerLogFormFields.Car]: {
            render: () => <CarPickerInput control={ control } fieldName="carId"/>,
            editToastMessages: EditToast
        },
        [OdometerLogFormFields.DateAndOdometerValue]: {
            render: () => <OdometerValueInput
                control={ control }
                setValue={ setValue }
                getFieldState={ getFieldState }
                idFieldName="id"
                carIdFieldName="carId"
                odometerValueFieldName="value"
                dateFieldName="date"
                changeCarOdometerValueWhenInputNotTouched={ !isEdit }
            />,
            editToastMessages: EditToast
        },
        [OdometerLogFormFields.Note]: {
            render: () => <NoteInput
                control={ control }
                setValue={ setValue }
                fieldName="note"
            />,
            editToastMessages: EditToast
        }
    }), [control, setValue, t, isEdit]);

    const fullForm: FormFields = {
        render: () => ([
            <React.Fragment key="car">
                { fields[OdometerLogFormFields.Car].render() }
            </React.Fragment>,
            <React.Fragment key="value">
                { fields[OdometerLogFormFields.DateAndOdometerValue].render() }
            </React.Fragment>,
            <React.Fragment key="note">
                { fields[OdometerLogFormFields.Note].render() }
            </React.Fragment>
        ]),
        editToastMessages: EditToast
    };

    return { fields, fullForm };
}