import React from "react";
import {StepProps} from "../../../constants/types/types";
import Input from "../../../components/Input/Input";
import {ICON_NAMES} from "../../../../../constants/constants";

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