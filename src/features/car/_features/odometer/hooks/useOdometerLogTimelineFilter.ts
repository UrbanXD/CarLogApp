import { FilterButtonProps } from "../../../../../components/filter/FilterButton.tsx";
import { useMemo, useState } from "react";
import { COLORS } from "../../../../../constants/index.ts";
import { OdometerLogTypeEnum } from "../model/enums/odometerLogTypeEnum.ts";

export function useOdometerLogTimelineFilter() {
    const [typeFilter, setTypeFilter] = useState<OdometerLogTypeEnum | null>(null);

    const filterButtons: Array<FilterButtonProps> = useMemo(() => [
        {
            title: "Mind",
            active: !typeFilter,
            onPress: () => setTypeFilter(null)
        },
        {
            title: "Egyéb",
            active: typeFilter === OdometerLogTypeEnum.SIMPLE,
            onPress: () => setTypeFilter(OdometerLogTypeEnum.SIMPLE)
        },
        {
            title: "Tankolás",
            active: typeFilter === OdometerLogTypeEnum.FUEL,
            activeColor: COLORS.fuelYellow,
            onPress: () => setTypeFilter(OdometerLogTypeEnum.FUEL)
        },
        {
            title: "Szervíz",
            active: typeFilter === OdometerLogTypeEnum.SERVICE,
            activeColor: COLORS.service,
            onPress: () => setTypeFilter(OdometerLogTypeEnum.SERVICE)
        }
    ], [typeFilter]);

    return { typeFilter, filterButtons };
}