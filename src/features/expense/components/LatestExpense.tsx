import { router, useFocusEffect } from "expo-router";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import React, { useCallback, useState } from "react";
import { Expense } from "../schemas/expenseSchema.ts";
import { Text, View } from "react-native";
import { GLOBAL_STYLE, ICON_NAMES } from "../../../constants/index.ts";
import Link from "../../../components/Link.tsx";
import useCars from "../../car/hooks/useCars.ts";
import { useExpenseTimelineItem } from "../hooks/useExepenseTimelineItem.tsx";
import { TimelineItem } from "../../../components/timelineView/item/TimelineItem.tsx";
import { MoreDataLoading } from "../../../components/loading/MoreDataLoading.tsx";

export function LatestExpenses() {
    const { expenseDao } = useDatabase();
    const { selectedCar } = useCars();
    const { mapper } = useExpenseTimelineItem(selectedCar.currency);

    const [expenses, setExpenses] = useState<Array<Expense>>([]);
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            if(!selectedCar) return;

            setIsLoading(true);
            expenseDao.getLatestExpenses(selectedCar.id).then(result => {
                setIsLoading(false);
                setExpenses(result);
            });
        }, [])
    );

    const renderExpense = (expense: Expense, index: number) => {
        if(!selectedCar) return <></>;

        return (
            <TimelineItem
                key={ expense.id }
                { ...mapper(expense) }
                isFirst={ index === 0 }
                isLast={ index === expenses.length - 1 }
            />
        );
    };

    const goToExpensesTab = () => router.push("/(main)/expenses");

    return (
        <View style={ GLOBAL_STYLE.contentContainer }>
            <Text style={ GLOBAL_STYLE.containerTitleText }>
                Legutóbbi kiadások
            </Text>
            {
                isLoading
                ?
                <MoreDataLoading/>
                :
                <View>{ expenses.map(renderExpense) }</View>
            }
            <Link
                text="További kiadások"
                icon={ ICON_NAMES.rightArrowHead }
                onPress={ goToExpensesTab }
            />
        </View>
    );
}