import BottomSheet from "../../../../../../ui/bottomSheet/components/BottomSheet.tsx";
import React from "react";
import { Place } from "../../schemas/placeSchema.ts";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { CreatePlaceForm } from "../../components/forms/CreatePlaceForm.tsx";
import { EditPlaceForm } from "../../components/forms/EditPlaceForm.tsx";
import { useTranslation } from "react-i18next";

type PlaceBottomSheetProps = {
    place?: Place
}

export function PlaceBottomSheet({ place }: PlaceBottomSheetProps) {
    const { t } = useTranslation();

    const TITLE = place ? undefined : t("places.create");
    const CONTENT = place ? <EditPlaceForm place={ place }/> : <CreatePlaceForm/>;
    const MAX_DYNAMIC_CONTENT_SIZE = heightPercentageToDP(85);

    return (
        <BottomSheet
            title={ TITLE }
            content={ CONTENT }
            maxDynamicContentSize={ MAX_DYNAMIC_CONTENT_SIZE }
            enableDynamicSizing
            enableDismissOnClose={ false }
            enableOverDrag={ false }
        />
    );
}