import React from "react";
import { Place } from "../../schemas/placeSchema.ts";
import { CreatePlaceForm } from "../../components/forms/CreatePlaceForm.tsx";
import { EditPlaceForm } from "../../components/forms/EditPlaceForm.tsx";
import { useTranslation } from "react-i18next";
import { FormBottomSheet } from "../../../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";

type PlaceBottomSheetProps = {
    place?: Place
}

export function PlaceBottomSheet({ place }: PlaceBottomSheetProps) {
    const { t } = useTranslation();

    const TITLE = place ? undefined : t("places.create");
    const CONTENT = place ? <EditPlaceForm place={ place }/> : <CreatePlaceForm/>;

    return (
        <FormBottomSheet
            title={ TITLE }
            content={ CONTENT }
            enableDynamicSizing
        />
    );
}