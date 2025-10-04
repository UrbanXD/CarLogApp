import { useCallback } from "react";
import { TimelineItemType } from "../../../components/timelineView/item/TimelineItem.tsx";
import dayjs from "dayjs";
import { Expense } from "../schemas/expenseSchema.ts";
import utc from "dayjs/plugin/utc";
import { router } from "expo-router";

dayjs.extend(utc);

export function useExpenseTimelineItem() {
    const mapper = useCallback((expense: Expense): TimelineItemType => {
        const onPress = () => router.push({
            pathname: "/expense/[id]",
            params: { id: expense.id }
        });

        return {
            id: expense.id,
            milestone: dayjs(expense.date).format("YYYY. MM DD. HH:mm"),
            title: expense.type.locale,
            icon: expense.type.icon,
            color: expense.type.primaryColor ?? undefined,
            iconColor: expense.type.secondaryColor ?? undefined,
            note: expense.note,
            footerText: `${ expense.amount } ${ expense.currency.symbol }`,
            onPress
        };
    });

    return { mapper };
};