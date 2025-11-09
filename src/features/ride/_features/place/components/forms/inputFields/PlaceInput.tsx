import { Control } from "react-hook-form";
import { useDatabase } from "../../../../../../../contexts/database/DatabaseContext.ts";
import React, { useMemo } from "react";
import Input from "../../../../../../../components/Input/Input.ts";
import { useCreatePlace } from "../../../hooks/useCreatePlace.ts";
import { useAppSelector } from "../../../../../../../hooks/index.ts";
import { getUser } from "../../../../../../user/model/selectors/index.ts";
import { AddItemToDropdownInput } from "../../../../../../../components/Input/_presets/AddItemToDropdownInput.tsx";

type PlaceInputProps = {
    control?: Control<any>
    fieldName?: string
    title?: string
}

export function PlaceInput({
    control,
    fieldName,
    title = "Hely"
}: PlaceInputProps) {
    const { placeDao } = useDatabase();
    const user = useAppSelector(getUser);
    if(!user) return <></>;

    const paginator = useMemo(() => placeDao.paginator(), []);

    const { form, submitHandler } = useCreatePlace({ userId: user.id, dismissSheet: false });

    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
        >
            <Input.Picker.Dropdown
                title={ title }
                paginator={ paginator }
                renderCreateItemForm={
                    (callback) => <AddItemToDropdownInput
                        control={ form.control }
                        fieldName={ "name" }
                        submitHandler={ () => submitHandler(callback)() }
                        placeholder={ "Új hely" }
                    />
                }
                searchBy="name"
                hideController
                selectWithoutSubmit
                popUpView={ false }
            />
        </Input.Field>
    );
}