import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { useEffect, useState } from "react";
import { FilterButtonProps } from "../../../../../components/filter/FilterButton.tsx";
import { ServiceType } from "../schemas/serviceTypeSchema.ts";
import { useTranslation } from "react-i18next";
import { SelectQueryBuilder } from "kysely";
import { ExtractColumnsFromQuery, FilterCondition } from "../../../../../database/hooks/useInfiniteQuery.ts";
import { FilterManager } from "../../../../../database/hooks/useFilters.ts";
import { CAR_TABLE } from "../../../../../database/connector/powersync/tables/car.ts";

const TYPES_FILTER_KEY = "type_filter";

type UseServiceLogTimelineFilterProps<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
> = {
    filterManager: FilterManager<QueryBuilder, Columns>
    carId: string
    carFilterFieldName: Columns
    typesFilterFieldName: Columns
}

export function useServiceLogTimelineFilter<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
>({
    filterManager: {
        filters,
        addFilter,
        replaceFilter,
        removeFilter,
        clearFilters
    },
    carId,
    carFilterFieldName,
    typesFilterFieldName
}: UseServiceLogTimelineFilterProps<QueryBuilder, Columns>) {
    const { t } = useTranslation();
    const { serviceTypeDao } = useDatabase();

    const [types, setTypes] = useState<Array<ServiceType>>([]);
    const [selectedTypesId, setSelectedTypesId] = useState<Array<ServiceType["id"]>>([]);

    useEffect(() => {
        (async () => {
            const types = await serviceTypeDao.getAll();

            // sort based on locale
            const sorted = types.sort((a, b) => {
                return t(`service.types.${ a.key }`).localeCompare(t(`service.types.${ b.key }`));
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
                        if(filter.field === typesFilterFieldName) ids.push(filter.value);
                    });

                    setSelectedTypesId(ids);
                    break;
            }
        }));
    }, [filters, typesFilterFieldName]);

    useEffect(() => {
        if(carId) replaceFilter({
            groupKey: CAR_TABLE,
            filter: { field: carFilterFieldName, operator: "=", value: carId }
        });
    }, [carId, carFilterFieldName]);

    const filterButtons: Array<FilterButtonProps> = types.map((type) => {
        const active = selectedTypesId.includes(type.id);
        const filter: FilterCondition<QueryBuilder, Columns> = {
            field: typesFilterFieldName,
            operator: "=",
            value: type.id
        };
        const onPress = () => {
            if(!active) {
                addFilter({ groupKey: TYPES_FILTER_KEY, filter, logic: "OR" });
            } else {
                removeFilter({ groupKey: TYPES_FILTER_KEY, filter: filter, byValue: true });
            }
        };

        return {
            title: t(`service.types.${ type.key }`),
            active,
            activeColor: type?.primaryColor ?? undefined,
            onPress
        };
    });

    filterButtons.unshift({
        title: t("common.filters.all"),
        active: selectedTypesId.length === 0,
        onPress: () => clearFilters(TYPES_FILTER_KEY)
    });

    return { filterButtons };
}