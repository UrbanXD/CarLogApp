import { FilterButtonProps } from "../../../components/filter/FilterButton.tsx";
import { useCallback, useEffect, useState } from "react";
import { COLORS } from "../../../constants/index.ts";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { ExpenseType } from "../schemas/expenseTypeSchema.ts";
import { ExpenseTypeEnum } from "../model/enums/ExpenseTypeEnum.ts";

export function useExpenseTimelineFilter() {
    const { expenseDao } = useDatabase();
    const [types, setTypes] = useState<Array<ExpenseType>>([]);
    const [typeFilter, setTypeFilter] = useState<ExpenseType | null>(null);

    useEffect(() => {
        const getTypes = (async () => {
            setTypes(await expenseDao.expenseTypeDao.getExpenseTypes());
        });

        getTypes();
    }, []);

    const selectTypeByKey = useCallback((key: ExpenseTypeEnum) => {
        const selectedType = types.find(type => type.key === key);
        if(!selectedType) setTypeFilter(null);
        setTypeFilter(selectedType);
    }, [types]);

    const filterButtons: Array<FilterButtonProps> = [
        {
            title: "Mind",
            active: !typeFilter,
            onPress: () => setTypeFilter(null)
        },
        {
            title: "Egyéb",
            active: typeFilter?.key === ExpenseTypeEnum.OTHER,
            onPress: () => selectTypeByKey(ExpenseTypeEnum.OTHER)
        },
        {
            title: "Tankolás",
            active: typeFilter?.key === ExpenseTypeEnum.FUEL,
            activeColor: COLORS.fuelYellow,
            onPress: () => selectTypeByKey(ExpenseTypeEnum.FUEL)
        },
        {
            title: "Szervíz",
            active: typeFilter?.key === ExpenseTypeEnum.SERVICE,
            activeColor: COLORS.service,
            onPress: () => selectTypeByKey(ExpenseTypeEnum.SERVICE)
        },
        {
            title: "Útdíj",
            active: typeFilter?.key === ExpenseTypeEnum.TOLL,
            activeColor: COLORS.toll,
            onPress: () => selectTypeByKey(ExpenseTypeEnum.TOLL)
        },
        {
            title: "Parkolás",
            active: typeFilter?.key === ExpenseTypeEnum.PARKING,
            activeColor: COLORS.parking,
            onPress: () => selectTypeByKey(ExpenseTypeEnum.PARKING)
        },
        {
            title: "Autómosás",
            active: typeFilter?.key === ExpenseTypeEnum.WASH,
            activeColor: COLORS.wash,
            onPress: () => selectTypeByKey(ExpenseTypeEnum.WASH)
        },
        {
            title: "Biztosítás",
            active: typeFilter?.key === ExpenseTypeEnum.INSURANCE,
            activeColor: COLORS.insurance,
            onPress: () => selectTypeByKey(ExpenseTypeEnum.INSURANCE)
        },
        {
            title: "Műszaki vizsgálat",
            active: typeFilter?.key === ExpenseTypeEnum.VEHICLE_INSPECTION,
            activeColor: COLORS.vehicleInspection,
            onPress: () => selectTypeByKey(ExpenseTypeEnum.VEHICLE_INSPECTION)
        }
    ];

    return { typeFilter, filterButtons };
}