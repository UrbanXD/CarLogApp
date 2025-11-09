import { useCallback } from "react";
import { ExpandableListItemProps } from "../../../components/expandableList/ExpandableListItem.tsx";
import { RidePlaceFormFields } from "../_features/place/schemas/form/ridePlaceForm.ts";

export function useRidePlaceToExpandableList() {
    const ridePlaceToExpandableList = useCallback((
        item: RidePlaceFormFields,
        index: number,
        array: Array<RidePlaceFormFields>
    ): ExpandableListItemProps => {
        let subtitle = `Megálló ${ index }`;
        if(index === 0) subtitle = "Indulás";
        if(index !== 0 && index === array.length - 1) subtitle = "Érkezés";

        return {
            id: item.id,
            title: item.name ?? "ismeretlen",
            subtitle
        };
    });

    return { ridePlaceToExpandableList };
}