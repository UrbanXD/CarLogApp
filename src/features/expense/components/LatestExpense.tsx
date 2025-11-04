import { router, useFocusEffect } from "expo-router";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import React, { useCallback, useState } from "react";
import { Expense } from "../schemas/expenseSchema.ts";
import { Text, View } from "react-native";
import { COLORS, GLOBAL_STYLE, ICON_NAMES } from "../../../constants/index.ts";
import Link from "../../../components/Link.tsx";
import { useExpenseTimelineItem } from "../hooks/useExepenseTimelineItem.tsx";
import { TimelineItem } from "../../../components/timelineView/item/TimelineItem.tsx";
import { MoreDataLoading } from "../../../components/loading/MoreDataLoading.tsx";
import { Car } from "../../car/schemas/carSchema.ts";

type LatestExpenseProps = {
    car?: Car | null
}

export function LatestExpenses({ car }: LatestExpenseProps) {
    const { expenseDao } = useDatabase();
    const { mapper } = useExpenseTimelineItem(car?.currency);

    const [expenses, setExpenses] = useState<Array<Expense>>([]);
    const [isLoading, setIsLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if(!car) return;

            setIsLoading(true);
            expenseDao.getLatestExpenses(car.id).then(result => {
                setIsLoading(false);
                setExpenses(result);
            });
        }, [car])
    );

    const renderExpense = (expense: Expense, index: number) => {
        return (
            <TimelineItem
                key={ expense.id }
                { ...mapper(expense) }
                isFirst={ index === 0 }
                isLast={ false }
            />
        );
    };

    const renderEmptyComponent = useCallback(() => {
        return (
            <TimelineItem
                id="not-found"
                milestone="Nem található"
                title={ "Hozzalétre első kiadását ide kattintva" }
                onPress={ openCreateExpenseBottomSheet }
                color={ COLORS.gray2 }
                isFirst
                isLast
            />
        );
    }, []);

    const goToExpensesTab = () => router.push("/(main)/expenses");
    const openCreateExpenseBottomSheet = () => router.push("/expense/create/");

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
                expenses.length > 0
                ? <View>{ expenses.map(renderExpense) }</View>
                : renderEmptyComponent()
            }
            <Link
                text="További kiadások"
                icon={ ICON_NAMES.rightArrowHead }
                onPress={ goToExpensesTab }
            />
        </View>
    );
}