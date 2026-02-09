import { CreateCarForm } from "../../components/forms/CreateCarForm.tsx";
import React from "react";
import { useTranslation } from "react-i18next";
import { FormBottomSheet } from "../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";
import { useUser } from "../../../user/hooks/useUser.ts";

export function CreateCarBottomSheet() {
    const { t } = useTranslation();
    const { user, isLoading } = useUser();

    return (
        <FormBottomSheet
            title={ t("car.create") }
            content={ user && <CreateCarForm user={ user }/> }
            isLoading={ isLoading }
        />
    );
}