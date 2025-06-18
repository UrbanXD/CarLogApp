import React from "react";
import Input from "../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { StepProps } from "../../../../../types/index.ts";

export const NameStep: React.FC<StepProps> = ({ control }) =>
    <Input.Group>
        <Input.Text
            control={ control }
            fieldName="lastname"
            fieldNameText="Vezetéknév"
            icon={ ICON_NAMES.user }
            placeholder="Kovács"
            isInBottomSheet
        />
        <Input.Text
            control={ control }
            fieldName="firstname"
            fieldNameText="Keresztnév"
            icon={ ICON_NAMES.user }
            placeholder="János"
            isInBottomSheet
        />
    </Input.Group>