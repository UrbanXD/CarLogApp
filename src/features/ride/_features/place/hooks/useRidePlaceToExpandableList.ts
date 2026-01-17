import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { RidePlaceFormFields } from "../schemas/form/ridePlaceForm.ts";
import { ExpandableListItemProps } from "../../../../../components/expandableList/ExpandableListItem.tsx";

export function useRidePlaceToExpandableList() {
    const { t } = useTranslation();

    const ridePlaceToExpandableList = useCallback((
        item: RidePlaceFormFields,
        index: number,
        array: Array<RidePlaceFormFields>
    ): ExpandableListItemProps => {
        let subtitle = t("places.stop", { index });
        if(index === 0) subtitle = t("places.start");
        if(index !== 0 && index === array.length - 1) subtitle = t("places.end");

        return {
            id: item.id,
            title: item.name ?? t("common.unknown"),
            subtitle
        };
    }, [t]);

    return { ridePlaceToExpandableList };
}