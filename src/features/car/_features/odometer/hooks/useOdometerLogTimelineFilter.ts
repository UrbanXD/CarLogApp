import { FilterButtonProps } from "../../../../../components/filter/FilterButton.tsx";
import { useState } from "react";
import { COLORS } from "../../../../../constants/index.ts";
import { OdometerLogType } from "../model/enums/odometerLogType.ts";

export function useOdometerLogTimelineFilter() {
    const [typeFilter, setTypeFilter] = useState<OdometerLogType | null>(null);

    const filterButtons: Array<FilterButtonProps> = [
        {
            title: "Mind",
            active: !typeFilter,
            onPress: () => setTypeFilter(null)
        },
        {
            title: "Egyéb",
            active: typeFilter === OdometerLogType.SIMPLE,
            onPress: () => setTypeFilter(OdometerLogType.SIMPLE)
        },
        {
            title: "Tankolás",
            active: typeFilter === OdometerLogType.FUEL,
            activeColor: COLORS.fuelYellow,
            onPress: () => setTypeFilter(OdometerLogType.FUEL)
        },
        {
            title: "Szervíz",
            active: typeFilter === OdometerLogType.SERVICE,
            activeColor: COLORS.service,
            onPress: () => setTypeFilter(OdometerLogType.SERVICE)
        }
    ];

    return { typeFilter, filterButtons };
}