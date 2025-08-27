import React from "react";
import Input from "../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { StepProps } from "../../../../../types/index.ts";

export const NameStep: React.FC<StepProps> = ({ control }) =>
    <Input.Group>
        <Input.Field
            control={ control }
            fieldName="lastname"
            fieldNameText="Vezetéknév"
        >
            <Input.Text
                icon={ ICON_NAMES.user }
                placeholder="Kovács"
            />
        </ Input.Field>
        <Input.Field
            control={ control }
            fieldName="firstname"
            fieldNameText="Keresztnév"
        >
            <Input.Text
                icon={ ICON_NAMES.user }
                placeholder="János"
            />
        </Input.Field>
    </Input.Group>;