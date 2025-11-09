import { useCallback } from "react";
import { RidePassengerFormFields } from "../schemas/form/ridePassengerForm.ts";
import { ExpandableListItemProps } from "../../../../../components/expandableList/ExpandableListItem.tsx";

export function useRidePassengerToExpandableList() {
    const ridePassengerToExpandableList = useCallback((item: RidePassengerFormFields): ExpandableListItemProps => {
        return {
            id: item.id,
            title: item.name ?? "ismeretlen"
        };
    });

    return { ridePassengerToExpandableList };
}