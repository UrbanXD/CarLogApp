import { FilterButtonProps } from "../../../../../components/filter/FilterButton.tsx";
import { useEffect, useState } from "react";
import { OdometerLogTypeEnum } from "../model/enums/odometerLogTypeEnum.ts";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { OdometerLogType } from "../schemas/odometerLogTypeSchema.ts";
import { useTranslation } from "react-i18next";
import { SelectQueryBuilder } from "kysely";
import { ExtractColumnsFromQuery, FilterCondition } from "../../../../../database/hooks/useInfiniteQuery.ts";
import { FilterManager } from "../../../../../database/hooks/useFilters.ts";
import { CAR_TABLE } from "../../../../../database/connector/powersync/tables/car.ts";

const TYPES_FILTER_KEY = "type_filter";

type UseOdometerLogTimelineFilterProps<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
> = {
    filterManager: FilterManager<QueryBuilder, Columns>,
    carId: string,
    carFilterFieldName: Columns,
    typesFilterFieldName: Columns,
}

export function useOdometerLogTimelineFilter<
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
}: UseOdometerLogTimelineFilterProps<QueryBuilder, Columns>) {
    const { t } = useTranslation();
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

                return t(`fuel.types.${ a.key }`).localeCompare(t(`fuel.types.${ a.key }`));
            });

            setTypes(sorted);
        })();
    }, [t]);

    useEffect(() => {
        if(!filters.has(TYPES_FILTER_KEY)) setSelectedTypesId([]);

        filters.forEach(((item, key) => {
            switch(key) {
                case TYPES_FILTER_KEY:
                    const ids: Array<OdometerLogType["id"]> = [];

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
            title: t(`odometer.types.${ type.key }`),
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