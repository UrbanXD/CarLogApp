import { router } from "expo-router";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import React, { useCallback, useMemo } from "react";
import { Expense } from "../schemas/expenseSchema.ts";
import { Text, View } from "react-native";
import { COLORS, GLOBAL_STYLE, ICON_NAMES } from "../../../constants";
import Link from "../../../components/Link.tsx";
import { useExpenseTimelineItem } from "../hooks/useExepenseTimelineItem.tsx";
import { TimelineItem } from "../../../components/timelineView/item/TimelineItem.tsx";
import { MoreDataLoading } from "../../../components/loading/MoreDataLoading.tsx";
import { useTranslation } from "react-i18next";
import { useWatchedQueryCollection } from "../../../database/hooks/useWatchedQueryCollection.ts";

type LatestExpenseProps = {
    carId: string
}

export function LatestExpenses({ carId }: LatestExpenseProps) {
    const { t } = useTranslation();
    const { expenseDao } = useDatabase();
    const { mapper } = useExpenseTimelineItem();

    const expensesQuery = useMemo(() => {
        return expenseDao.latestExpenseWatchedQueryCollection(carId);
    }, [expenseDao, carId]);

    const { data: expenses, isLoading } = useWatchedQueryCollection(expensesQuery);

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
                milestone={ t("expenses.not_found") }
                title={ t("expenses.not_found_action_call") }
                onPress={ openCreateExpenseBottomSheet }
                color={ COLORS.gray2 }
                isFirst
                isLast
            />
        );
    }, [t]);

    const goToExpensesTab = () => router.push("/(main)/expenses");
    const openCreateExpenseBottomSheet = () => router.push("/expense/create/");

    return (
        <View style={ GLOBAL_STYLE.contentContainer }>
            <Text style={ GLOBAL_STYLE.containerTitleText }>
                { t("expenses.latest") }
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
                text={ t("expenses.more") }
                icon={ ICON_NAMES.rightArrowHead }
                onPress={ goToExpensesTab }
            />
        </View>
    );
}