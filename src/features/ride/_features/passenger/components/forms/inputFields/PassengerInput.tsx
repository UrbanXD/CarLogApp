import { Control } from "react-hook-form";
import { useDatabase } from "../../../../../../../contexts/database/DatabaseContext.ts";
import React, { useMemo } from "react";
import Input from "../../../../../../../components/Input/Input.ts";
import { useCreatePassenger } from "../../../hooks/useCreatePassenger.ts";
import { useAppSelector } from "../../../../../../../hooks/index.ts";
import { getUser } from "../../../../../../user/model/selectors/index.ts";
import { AddItemToDropdownInput } from "../../../../../../../components/Input/_presets/AddItemToDropdownInput.tsx";
import { useTranslation } from "react-i18next";

type PlaceInputProps = {
    control: Control<any>
    fieldName: string
    title?: string
}

export function PassengerInput({
    control,
    fieldName,
    title
}: PlaceInputProps) {
    const { t } = useTranslation();
    const { passengerDao } = useDatabase();
    const user = useAppSelector(getUser);
    if(!user) return <></>;

    const paginator = useMemo(() => passengerDao.pickerPaginator(), []);

    const { form, submitHandler } = useCreatePassenger({ userId: user.id, dismissSheet: false });

    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
        >
            <Input.Picker.Dropdown
                title={ title ?? t("passengers.title_singular") }
                paginator={ paginator }
                renderCreateItemForm={
                    (callback) => {
                        const handler = submitHandler(callback);
                        return (
                            <AddItemToDropdownInput
                                control={ form.control }
                                fieldName={ "name" }
                                submitHandler={ form.handleSubmit(handler.onValid, handler.onInvalid) }
                                placeholder={ t("passengers.new") }
                            />
                        );
                    }
                }
                searchBy="name"
                hideController
                selectWithoutSubmit
                popUpView={ false }
            />
        </Input.Field>
    );
}