import { useCallback } from "react";
import { RidePassengerFormFields } from "../schemas/form/ridePassengerForm.ts";
import { ExpandableListItemProps } from "../../../../../components/expandableList/ExpandableListItem.tsx";
import { useTranslation } from "react-i18next";

export function useRidePassengerToExpandableList() {
    const { t } = useTranslation();

    const ridePassengerToExpandableList = useCallback((item: RidePassengerFormFields): ExpandableListItemProps => {
        return {
            id: item.id,
            title: item.name ?? t("common.unknown")
        };
    });

    return { ridePassengerToExpandableList };
}