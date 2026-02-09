import { Control } from "react-hook-form";
import { useDatabase } from "../../../../../../../contexts/database/DatabaseContext.ts";
import React, { useMemo } from "react";
import Input from "../../../../../../../components/Input/Input.ts";
import { useCreatePlace } from "../../../hooks/useCreatePlace.ts";
import { AddItemToDropdownInput } from "../../../../../../../components/Input/_presets/AddItemToDropdownInput.tsx";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../../../../../contexts/auth/AuthContext.ts";

type PlaceInputProps = {
    control: Control<any>
    fieldName: string
    title?: string
}

export function PlaceInput({
    control,
    fieldName,
    title
}: PlaceInputProps) {
    const { t } = useTranslation();
    const { placeDao } = useDatabase();
    const { sessionUserId } = useAuth();

    if(!sessionUserId) return null;

    const queryOptions = useMemo(() => placeDao.pickerInfiniteQuery(sessionUserId), [sessionUserId]);

    const { form, submitHandler } = useCreatePlace({ userId: sessionUserId, dismissSheet: false });
    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
        >
            <Input.Picker.Dropdown<typeof queryOptions["baseQuery"]>
                title={ title ?? t("places.title_singular") }
                queryOptions={ queryOptions }
                renderCreateItemForm={
                    (callback) => {
                        const handler = submitHandler(callback);
                        return (
                            <AddItemToDropdownInput
                                control={ form.control }
                                fieldName="name"
                                submitHandler={ form.handleSubmit(handler.onValid, handler.onInvalid) }
                                placeholder={ t("places.new") }
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