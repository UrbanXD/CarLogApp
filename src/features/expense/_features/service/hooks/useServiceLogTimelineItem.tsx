import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import React, { ReactNode, useCallback } from "react";
import { TimelineItemType } from "../../../../../components/timelineView/item/TimelineItem.tsx";
import { router } from "expo-router";
import { AmountText } from "../../../../../components/AmountText.tsx";
import { ServiceLog } from "../schemas/serviceLogSchema.ts";
import { useTranslation } from "react-i18next";

dayjs.extend(utc);

export function useServiceLogTimelineItem() {
    const mapper = useCallback((
        serviceLog: ServiceLog,
        callback?: () => void
    ): TimelineItemType => {
        const { t } = useTranslation();

        const onPress = () => {
            callback?.();

            router.push({
                pathname: "/expense/service/[id]",
                params: { id: serviceLog.id, title: t("service.log") }
            });
        };

        let footer: ReactNode = (
            <AmountText
                amount={ serviceLog.expense.amount.amount }
                currencyText={ serviceLog.expense.amount.currency.symbol }
                exchangedAmount={ serviceLog.expense.amount.exchangedAmount }
                exchangeCurrencyText={ serviceLog.expense.amount.exchangeCurrency.symbol }
            />
        );

        return {
            id: serviceLog.id,
            milestone: dayjs(serviceLog.expense.date).format("YYYY. MM DD. HH:mm"),
            title: t(`service.types.${ serviceLog.serviceType.key }`),
            icon: serviceLog.expense.type.icon,
            color: serviceLog.expense.type.primaryColor ?? undefined,
            iconColor: serviceLog.expense.type.secondaryColor ?? undefined,
            note: serviceLog.expense.note,
            footerText: footer,
            onPress
        };
    }, []);

    return { mapper };
}