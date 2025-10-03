import { useCallback } from "react";
import { TimelineItemType } from "../../../components/timelineView/item/TimelineItem.tsx";
import { COLORS, ICON_NAMES } from "../../../constants/index.ts";
import dayjs from "dayjs";
import { Expense } from "../schemas/expenseSchema.ts";
import { ExpenseTypeEnum } from "../model/enums/ExpenseTypeEnum.ts";
import utc from "dayjs/plugin/utc";
import { router } from "expo-router";

dayjs.extend(utc);

export function useExpenseTimelineItem() {
    const mapper = useCallback((expense: Expense): TimelineItemType => {
        let title = "Egyéb";
        let color;
        let icon;
        const onPress = () => router.push({
            pathname: "/expense/[id]",
            params: { id: expense.id }
        });

        switch(expense.type.key) {
            case ExpenseTypeEnum.FUEL:
                title = "Tankolás";
                icon = ICON_NAMES.fuelPump;
                color = COLORS.fuelYellow;
                break;
            case ExpenseTypeEnum.SERVICE:
                title = "Szervíz";
                icon = ICON_NAMES.service;
                color = COLORS.service;
                break;
            case ExpenseTypeEnum.VEHICLE_INSPECTION:
                title = "Műszaki vizsgálat";
                icon = ICON_NAMES.vehicleInspection;
                color = COLORS.vehicleInspection;
                break;
            case ExpenseTypeEnum.WASH:
                title = "Autómosás";
                icon = ICON_NAMES.carWash;
                color = COLORS.wash;
                break;
            case ExpenseTypeEnum.TOLL:
                title = "Útdíj";
                icon = ICON_NAMES.road;
                color = COLORS.toll;
                break;
            case ExpenseTypeEnum.PARKING:
                title = "Parkolás";
                icon = ICON_NAMES.parking;
                color = COLORS.parking;
                break;
            case ExpenseTypeEnum.INSURANCE:
                title = "Biztosítás";
                icon = ICON_NAMES.insurance;
                color = COLORS.insurance;
                break;

        }

        return {
            id: expense.id,
            milestone: dayjs(expense.date).format("YYYY. MM DD. HH:mm"),
            title,
            icon,
            color,
            note: expense.note,
            footerText: `${ expense.amount } ${ expense.currency }`,
            onPress
        };
    });

    return { mapper };
};