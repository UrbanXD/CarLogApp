import React from "react";
import { StepProps } from "../../../../Form/constants/types/types.ts";
import Input from "../../../../Form/components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";

const NameStep: React.FC<StepProps> = ({
    control
}) =>
    <Input.Text
        control={ control }
        fieldName="name"
        fieldNameText="Autó azonosító"
        fieldInfoText="Az autó elnevezése, azonosítója mely az Ön számára lehet fontos autója azonosításakor."
        placeholder="AA-0000-BB"
        icon={ ICON_NAMES.nametag }
        isInBottomSheet
    />

export default NameStep;