import { FilterButtonProps } from "../../../../../components/filter/FilterButton.tsx";
import { useEffect, useState } from "react";
import { OdometerLogTypeEnum } from "../model/enums/odometerLogTypeEnum.ts";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { OdometerLogType } from "../schemas/odometerLogTypeSchema.ts";
import { FilterManagement } from "../../../../../hooks/useFilterBy.ts";
import { Car } from "../../../schemas/carSchema.ts";
import { OdometerLogTableRow } from "../../../../../database/connector/powersync/AppSchema.ts";

const TYPES_FILTER_KEY = "type_filter";
const TYPES_FILTER_FIELD_NAME = "type_id";

type UseOdometerLogTimelineFilterProps = {
    filterManagement: FilterManagement<OdometerLogTableRow>,
    car: Car
}

export function useOdometerLogTimelineFilter({
    filterManagement: {
        filters,
        addFilter,
        removeFilter,
        clearFilterGroup
    },
    car
}: UseOdometerLogTimelineFilterProps) {
    const { odometerLogTypeDao } = useDatabase();
    const [types, setTypes] = useState<Array<OdometerLogType>>([]);
    const [selectedTypesId, setSelectedTypesId] = useState<Array<OdometerLogType["id"]>>([]);

    useEffect(() => {
        (async () => {
            const types = await odometerLogTypeDao.getAll();

            // sort based on locale
            const sorted = types.sort((a, b) => {
                // make simple type first
                if(a.id === OdometerLogTypeEnum.SIMPLE) return -1;
                if(b.id === OdometerLogTypeEnum.SIMPLE) return 1;

                return a.locale.localeCompare(b.locale);
            });


            setTypes(sorted);
        })();
    }, []);

    useEffect(() => {
        filters.forEach(((item, key) => {
            switch(key) {
                case TYPES_FILTER_KEY:
                    const ids: Array<string> = [];

                    item.filters.forEach(filter => {
                        if(filter.field === TYPES_FILTER_FIELD_NAME) ids.push(filter.value);
                    });

                    setSelectedTypesId(ids);
                    break;
            }
        }));
    }, [filters]);

    useEffect(() => {
        addFilter({ field: "car_id", operator: "=", value: car.id }, "car");
    }, [car]);

    const filterButtons: Array<FilterButtonProps> = types.map((type) => {
        const active = selectedTypesId.includes(type.id);
        const filter = { field: TYPES_FILTER_FIELD_NAME, operator: "=", value: type.id };
        const onPress = () => {
            if(!active) {
                addFilter(filter, TYPES_FILTER_KEY, "or");
            } else {
                removeFilter(TYPES_FILTER_KEY, filter);
            }
        };

        return {
            title: type.locale,
            active,
            activeColor: type?.primaryColor ?? undefined,
            onPress
        };
    });

    filterButtons.unshift({
        title: "Mind",
        active: selectedTypesId.length === 0,
        onPress: () => clearFilterGroup(TYPES_FILTER_KEY)
    });

    return { filterButtons };
}