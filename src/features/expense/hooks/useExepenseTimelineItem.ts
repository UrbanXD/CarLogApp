import { useCallback } from "react";
import { TimelineItemType } from "../../../components/timelineView/item/TimelineItem.tsx";
import dayjs from "dayjs";
import { Expense } from "../schemas/expenseSchema.ts";
import utc from "dayjs/plugin/utc";
import { router } from "expo-router";
import { Currency } from "../../_shared/currency/schemas/currencySchema.ts";

dayjs.extend(utc);

export function useExpenseTimelineItem(currency: Currency) {
    const mapper = useCallback((expense: Expense): TimelineItemType => {
        const onPress = () => router.push({
            pathname: "/expense/[id]",
            params: { id: expense.id }
        });

        let footer = `${ expense.originalAmount } ${ expense.currency.symbol }`;
        if(expense.currency.id !== currency.id) footer += ` (${ expense.amount } ${ currency.symbol })`;

        return {
            id: expense.id,
            milestone: dayjs(expense.date).format("YYYY. MM DD. HH:mm"),
            title: expense.type.locale,
            icon: expense.type.icon,
            color: expense.type.primaryColor ?? undefined,
            iconColor: expense.type.secondaryColor ?? undefined,
            note: expense.note,
            footerText: footer,
            onPress
        };
    }, [currency]);

    return { mapper };
};