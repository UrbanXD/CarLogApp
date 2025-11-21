import React, { ReactNode, useCallback } from "react";
import { TimelineItemType } from "../../../components/timelineView/item/TimelineItem.tsx";
import dayjs from "dayjs";
import { Expense } from "../schemas/expenseSchema.ts";
import utc from "dayjs/plugin/utc";
import { router } from "expo-router";
import { ExpenseTypeEnum } from "../model/enums/ExpenseTypeEnum.ts";
import { AmountText } from "../../../components/AmountText.tsx";
import { useTranslation } from "react-i18next";

dayjs.extend(utc);

export function useExpenseTimelineItem() {
    const { t } = useTranslation();

    const mapper = useCallback((expense: Expense, callback?: () => void): TimelineItemType => {
        const routerPathTitle = t("expenses.item_title");
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

            callback?.();
            router.push({
                pathname: routerPathName,
                params: { id: itemId, title: routerPathTitle }
            });
        };

        let footer: ReactNode = (
            <AmountText
                amount={ expense.amount.amount }
                currencyText={ expense.amount.currency.symbol }
                exchangedAmount={ expense.amount.exchangedAmount }
                exchangeCurrencyText={ expense.amount.exchangeCurrency.symbol }
            />
        );

        return {
            id: expense.id,
            milestone: dayjs(expense.date).format("YYYY. MM DD. HH:mm"),
            title: t(`expenses.types.${ expense.type.key }`),
            icon: expense.type.icon,
            color: expense.type.primaryColor ?? undefined,
            iconColor: expense.type.secondaryColor ?? undefined,
            note: expense.note,
            footerText: footer,
            onPress
        };
    }, []);

    return { mapper };
}