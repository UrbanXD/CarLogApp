import { FilterButtonProps } from "../../../components/filter/FilterButton.tsx";
import { useEffect, useState } from "react";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { ExpenseType } from "../schemas/expenseTypeSchema.ts";
import { ExpenseTypeEnum } from "../model/enums/ExpenseTypeEnum.ts";
import { useTranslation } from "react-i18next";
import { FilterManager } from "../../../database/hooks/useFilters.ts";
import { ExtractColumnsFromQuery, FilterCondition } from "../../../database/hooks/useInfiniteQuery.ts";
import { SelectQueryBuilder } from "kysely";
import { CAR_TABLE } from "../../../database/connector/powersync/tables/car.ts";

const TYPES_FILTER_KEY = "type_filter";

type UseExpenseTimelineFilterProps<
    QueryBuilder extends SelectQueryBuilder<any, any, any>,
    Columns = ExtractColumnsFromQuery<QueryBuilder>
> = {
    filterManager: FilterManager<QueryBuilder, Columns>,
    carId: string,
    carFilterFieldName: Columns,
    typesFilterFieldName: Columns,
}

export function useExpenseTimelineFilter<
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
}: UseExpenseTimelineFilterProps<QueryBuilder, Columns>) {
    const { t, i18n } = useTranslation();
    const { expenseTypeDao } = useDatabase();

    const [types, setTypes] = useState<Array<ExpenseType>>([]);
    const [selectedTypesId, setSelectedTypesId] = useState<Array<ExpenseType["id"]>>([]);

    useEffect(() => {
        (async () => {
            const types = await expenseTypeDao.getAll();

            // sort based on locale
            const sorted = types.sort((a, b) => {
                //Make other first
                if(a.key === t(ExpenseTypeEnum.OTHER)) return -1;
                if(b.key === ExpenseTypeEnum.OTHER) return 1;

                return t(`expenses.types.${ a.key }`).localeCompare(t(`expenses.types.${ a.key }`));
            });

            setTypes(sorted);
        })();
    }, [i18n.language]);

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
            title: t(`expenses.types.${ type.key }`),
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