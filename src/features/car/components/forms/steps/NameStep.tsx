import React from "react";
import Input from "../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { StepProps } from "../../../../../types/index.ts";
import { CarFormFields } from "../../../schemas/form/carForm.ts";

type NameStepProps<FormFieldsType> = Pick<StepProps<FormFieldsType>, "control">;

function NameStep<FormFieldsType = CarFormFields>({ control }: NameStepProps<FormFieldsType>) {
    return (
        <Input.Field
            control={ control }
            fieldName="name"
            fieldNameText="Autó azonosító"
            fieldInfoText="Az autó elnevezése, azonosítója mely az Ön számára lehet fontos autója azonosításakor."
        >
            <Input.Text
                icon={ ICON_NAMES.nametag }
                placeholder="Új Autóm"
            />
        </Input.Field>
    );
}

export default NameStep;