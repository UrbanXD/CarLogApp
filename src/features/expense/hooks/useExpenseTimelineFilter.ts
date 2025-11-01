import { FilterButtonProps } from "../../../components/filter/FilterButton.tsx";
import { useEffect, useState } from "react";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { ExpenseType } from "../schemas/expenseTypeSchema.ts";
import { ExpenseTypeEnum } from "../model/enums/ExpenseTypeEnum.ts";
import { Car } from "../../car/schemas/carSchema.ts";
import { SelectExpenseTableRow } from "../model/mapper/expenseMapper.ts";
import { TimelineFilterManagement } from "../../../hooks/useTimelinePaginator.ts";

const TYPES_FILTER_KEY = "type_filter";
const TYPES_FILTER_FIELD_NAME = "type_id";

type UseExpenseTimelineFilterProps = {
    timelineFilterManagement: TimelineFilterManagement<SelectExpenseTableRow>,
    car: Car
}

export function useExpenseTimelineFilter({
    timelineFilterManagement: {
        filters,
        addFilter,
        removeFilter,
        clearFilters
    },
    car
}: UseExpenseTimelineFilterProps) {
    const { expenseTypeDao } = useDatabase();
    const [types, setTypes] = useState<Array<ExpenseType>>([]);
    const [selectedTypesId, setSelectedTypesId] = useState<Array<ExpenseType["id"]>>([]);

    useEffect(() => {
        (async () => {
            const types = await expenseTypeDao.getAll();

            // sort based on locale
            const sorted = types.sort((a, b) => {
                //Make other first
                if(a.key === ExpenseTypeEnum.OTHER) return -1;
                if(b.key === ExpenseTypeEnum.OTHER) return 1;

                return a.locale.localeCompare(b.locale);
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
        addFilter({ groupKey: "car", filter: { field: "car_id", operator: "=", value: car.id } });
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
            title: type.locale,
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