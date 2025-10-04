import { FilterButtonProps } from "../../../components/filter/FilterButton.tsx";
import { useEffect, useState } from "react";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { ExpenseType } from "../schemas/expenseTypeSchema.ts";
import { ExpenseTypeEnum } from "../model/enums/ExpenseTypeEnum.ts";

export function useExpenseTimelineFilter() {
    const { expenseTypeDao } = useDatabase();
    const [types, setTypes] = useState<Array<ExpenseType>>([]);
    const [typeFilter, setTypeFilter] = useState<ExpenseType | null>(null);

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

    const filterButtons: Array<FilterButtonProps> = types.map((type) => ({
        title: type.locale,
        active: typeFilter?.key === type.key,
        activeColor: typeFilter?.primaryColor ?? undefined,
        onPress: () => setTypeFilter(type)
    }));

    filterButtons.unshift({ title: "Mind", active: !typeFilter, onPress: () => setTypeFilter(null) });

    return { typeFilter, filterButtons };
}