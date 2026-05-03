import { UseFormReturn, useFormState, useWatch } from "react-hook-form";
import React, { useEffect, useMemo } from "react";
import { FormFields } from "../../../../../types";
import { CarPickerInput } from "../../../components/forms/inputFields/CarPickerInput.tsx";
import { NoteInput } from "../../../../../components/Input/_presets/NoteInput.tsx";
import { OdometerLogFormFieldsEnum } from "../enums/odometerLogFormFields.ts";
import { OdometerValueInput } from "../components/forms/inputFields/OdometerValueInput.tsx";
import { OdometerChangeLogFormFields } from "../schemas/form/odometerChangeLogForm.ts";
import { EditToast } from "../../../../../ui/alert/presets/toast";
import { useTranslation } from "react-i18next";
import Input from "../../../../../components/Input/Input.ts";

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

    const odometerValueInput = useMemo(() => (
        <OdometerValueInput
            control={ control }
            setValue={ setValue }
            getFieldState={ getFieldState }
            idFieldName="id"
            carIdFieldName="carId"
            odometerValueFieldName="value"
            dateFieldName="date"
            changeCarOdometerValueWhenInputNotTouched={ !isEdit }
        />
    ), [control, setValue, getFieldState, isEdit]);

    const fields: Record<OdometerLogFormFieldsEnum, FormFields> = useMemo(() => ({
        [OdometerLogFormFieldsEnum.Car]: {
            render: () => <CarPickerInput control={ control } fieldName="carId"/>,
            editToastMessages: EditToast
        },
        [OdometerLogFormFieldsEnum.CarWithDateAndOdometerValue]: {
            render: () => {
                const { errors, dirtyFields } = useFormState({ control });

                const showDateAndOdometerValueInput = !!(
                    errors.date ||
                    errors.value ||
                    dirtyFields.date ||
                    dirtyFields.value
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
        [OdometerLogFormFieldsEnum.DateAndOdometerValue]: {
            render: () => odometerValueInput,
            editToastMessages: EditToast
        },
        [OdometerLogFormFieldsEnum.Note]: {
            render: () => <NoteInput
                control={ control }
                setValue={ setValue }
                fieldName="note"
            />,
            editToastMessages: EditToast
        }
    }), [control, setValue, t, isEdit, odometerValueInput]);

    const fullForm: FormFields = {
        render: () => ([
            <React.Fragment key="car">
                { fields[OdometerLogFormFieldsEnum.Car].render() }
            </React.Fragment>,
            <React.Fragment key="value">
                { fields[OdometerLogFormFieldsEnum.DateAndOdometerValue].render() }
            </React.Fragment>,
            <React.Fragment key="note">
                { fields[OdometerLogFormFieldsEnum.Note].render() }
            </React.Fragment>
        ]),
        editToastMessages: EditToast
    };

    return { fields, fullForm };
}