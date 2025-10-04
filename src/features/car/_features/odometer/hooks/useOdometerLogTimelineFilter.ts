import { FilterButtonProps } from "../../../../../components/filter/FilterButton.tsx";
import { useEffect, useState } from "react";
import { OdometerLogTypeEnum } from "../model/enums/odometerLogTypeEnum.ts";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { OdometerLogType } from "../schemas/odometerLogTypeSchema.ts";
import { ExpenseType } from "../../../../expense/schemas/expenseTypeSchema.ts";

export function useOdometerLogTimelineFilter() {
    const { odometerLogTypeDao } = useDatabase();
    const [types, setTypes] = useState<Array<ExpenseType>>([]);
    const [typeFilter, setTypeFilter] = useState<OdometerLogType["id"] | null>(null);

    useEffect(() => {
        (async () => {
            const types = await odometerLogTypeDao.getAll();

            // sort based on locale
            const sorted = types.sort((a, b) => {
                //Make simple first
                if(a.id === OdometerLogTypeEnum.SIMPLE) return -1;
                if(b.id === OdometerLogTypeEnum.SIMPLE) return 1;

                return a.locale.localeCompare(b.locale);
            });


            setTypes(sorted);
        })();
    }, []);

    const filterButtons: Array<FilterButtonProps> = types.map((type) => ({
        title: type.locale,
        active: typeFilter === type.id,
        activeColor: type.primaryColor ?? undefined,
        onPress: () => setTypeFilter(type.id)
    }));

    filterButtons.unshift({ title: "Mind", active: !typeFilter, onPress: () => setTypeFilter(null) });

    return { typeFilter, filterButtons };
}