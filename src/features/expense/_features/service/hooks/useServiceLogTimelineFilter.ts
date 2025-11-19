import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { useEffect, useState } from "react";
import { FilterButtonProps } from "../../../../../components/filter/FilterButton.tsx";
import { ServiceType } from "../schemas/serviceTypeSchema.ts";
import { Car } from "../../../../car/schemas/carSchema.ts";
import { ExpenseTableRow, ServiceLogTableRow } from "../../../../../database/connector/powersync/AppSchema.ts";
import { TimelineFilterManagement } from "../../../../../hooks/useTimelinePaginator.ts";

const TYPES_FILTER_KEY = "type_filter";
const TYPES_FILTER_FIELD_NAME = "service_type_id";

type UseServiceLogTimelineFilterProps = {
    timelineFilterManagement: TimelineFilterManagement<ExpenseTableRow & ServiceLogTableRow>,
    car: Car
}

export function useServiceLogTimelineFilter({
    timelineFilterManagement: {
        filters,
        addFilter,
        replaceFilter,
        removeFilter,
        clearFilters
    },
    car
}: UseServiceLogTimelineFilterProps) {
    const { serviceTypeDao } = useDatabase();
    const [types, setTypes] = useState<Array<ServiceType>>([]);
    const [selectedTypesId, setSelectedTypesId] = useState<Array<ServiceType["id"]>>([]);

    useEffect(() => {
        (async () => {
            const types = await serviceTypeDao.getAll();

            // sort based on locale
            const sorted = types.sort((a, b) => {
                return a.key.localeCompare(b.key);
            });


            setTypes(sorted);
        })();
    }, []);

    useEffect(() => {
        if(!filters.has(TYPES_FILTER_KEY)) setSelectedTypesId([]);

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
        if(car) replaceFilter({ groupKey: "car", filter: { field: "car_id", operator: "=", value: car.id } });
    }, [car]);

    const filterButtons: Array<FilterButtonProps> = types.map((type) => {
        const active = selectedTypesId.includes(type.id);
        const filter = { field: TYPES_FILTER_FIELD_NAME, operator: "=", value: type.id };
        const onPress = () => {
            if(!active) {
                addFilter({ groupKey: TYPES_FILTER_KEY, filter, logic: "OR" });
            } else {
                removeFilter({ groupKey: TYPES_FILTER_KEY, filter: filter, byValue: true });
            }
        };

        return {
            title: type.key,
            active,
            activeColor: type?.primaryColor ?? undefined,
            onPress
        };
    });

    filterButtons.unshift({
        title: "Mind",
        active: selectedTypesId.length === 0,
        onPress: () => clearFilters(TYPES_FILTER_KEY)
    });

    return { filterButtons };
}