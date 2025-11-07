import { Control } from "react-hook-form";
import { useDatabase } from "../../../../../../../contexts/database/DatabaseContext.ts";
import React, { useMemo } from "react";
import Input from "../../../../../../../components/Input/Input.ts";
import { ICON_NAMES } from "../../../../../../../constants/index.ts";
import { useCreatePassenger } from "../../../hooks/useCreatePassenger.ts";
import { useAppSelector } from "../../../../../../../hooks/index.ts";
import { getUser } from "../../../../../../user/model/selectors/index.ts";
import { AddItemToDropdownInput } from "../../../../../../../components/Input/_presets/AddItemToDropdownInput.tsx";

type PlaceInputProps = {
    control?: Control<any>
    fieldName?: string
    title?: string
    subtitle?: string
}

export function PassengerInput({
    control,
    fieldName,
    title = "Utas",
    subtitle
}: PlaceInputProps) {
    const { passengerDao } = useDatabase();
    const user = useAppSelector(getUser);
    if(!user) return <></>;

    const paginator = useMemo(() => passengerDao.paginator(), []);

    const { form, submitHandler } = useCreatePassenger({ userId: user.id, dismissSheet: false });

    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
            fieldNameText={ title }
            fieldInfoText={ subtitle }
        >
            <Input.Picker.Dropdown
                title={ title }
                paginator={ paginator }
                renderCreateItemForm={
                    (callback) => <AddItemToDropdownInput
                        control={ form.control }
                        fieldName={ "name" }
                        submitHandler={ () => submitHandler(callback)() }
                        placeholder={ "Új utas" }
                    />
                }
                searchBy="name"
                icon={ ICON_NAMES.passenger }
            />
        </Input.Field>
    );
}