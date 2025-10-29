import React, { ReactNode, useCallback } from "react";
import { TimelineItemType } from "../../../components/timelineView/item/TimelineItem.tsx";
import dayjs from "dayjs";
import { Expense } from "../schemas/expenseSchema.ts";
import utc from "dayjs/plugin/utc";
import { router } from "expo-router";
import { Currency } from "../../_shared/currency/schemas/currencySchema.ts";
import { ExpenseTypeEnum } from "../model/enums/ExpenseTypeEnum.ts";
import { AmountText } from "../../../components/AmountText.tsx";

dayjs.extend(utc);

export function useExpenseTimelineItem(currency: Currency) {
    const mapper = useCallback((expense: Expense): TimelineItemType => {
        const routerPathTitle = "Kiadás";
        let routerPathName = "/expense/[id]";
        let itemId = expense.id;

        switch(expense.type.key) {
            case ExpenseTypeEnum.FUEL:
                routerPathName = "/expense/fuel/[id]";
                itemId = expense?.relatedId;
                break;
            case ExpenseTypeEnum.SERVICE:
                routerPathName = "/expense/service/[id]";
                itemId = expense?.relatedId;
        }

        const onPress = () => {
            if(!itemId) return;

            router.push({
                pathname: routerPathName,
                params: { id: itemId, title: routerPathTitle }
            });
        };

        let footer: ReactNode = (
            <AmountText
                amount={ expense.originalAmount }
                currencyText={ expense.currency.symbol }
                exchangedAmount={ expense.amount }
                exchangeCurrencyText={ currency.symbol }
            />
        );

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
}