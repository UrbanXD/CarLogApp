import { useCallback } from "react";
import { TimelineItemType } from "../../../components/timelineView/item/TimelineItem.tsx";
import { COLORS, ICON_NAMES } from "../../../constants/index.ts";
import { Alert } from "react-native";
import dayjs from "dayjs";
import { Expense } from "../schemas/expenseSchema.ts";
import { ExpenseTypeEnum } from "../model/enums/ExpenseTypeEnum.ts";

export const useExpenseTimelineItem = () => {
    const mapper = useCallback((expense: Expense): TimelineItemType => {
        let title = "Egyéb";
        let color;
        let icon;
        let onPressInfo;

        switch(expense.type.key) {
            case ExpenseTypeEnum.FUEL:
                title = "Tankolás";
                icon = ICON_NAMES.fuelPump;
                color = COLORS.fuelYellow;
                onPressInfo = () => { Alert.alert("fuelocska"); };
                break;
            case ExpenseTypeEnum.SERVICE:
                title = "Szervíz";
                icon = ICON_NAMES.service;
                color = COLORS.service;
                onPressInfo = () => Alert.alert(" SZERVIZECSKE ");
                break;
            case ExpenseTypeEnum.VEHICLE_INSPECTION:
                title = "Műszaki vizsgálat";
                icon = ICON_NAMES.vehicleInspection;
                color = COLORS.vehicleInspection;
                onPressInfo = () => Alert.alert(" SZERVIZECSKE ");
                break;
            case ExpenseTypeEnum.WASH:
                title = "Autómosás";
                icon = ICON_NAMES.carWash;
                color = COLORS.wash;
                onPressInfo = () => Alert.alert(" SZERVIZECSKE ");
                break;
            case ExpenseTypeEnum.TOLL:
                title = "Útdíj";
                icon = ICON_NAMES.road;
                color = COLORS.toll;
                onPressInfo = () => Alert.alert(" SZERVIZECSKE ");
                break;
            case ExpenseTypeEnum.PARKING:
                title = "Parkolás";
                icon = ICON_NAMES.parking;
                color = COLORS.parking;
                onPressInfo = () => Alert.alert(" SZERVIZECSKE ");
                break;
            case ExpenseTypeEnum.INSURANCE:
                title = "Biztosítás";
                icon = ICON_NAMES.insurance;
                color = COLORS.insurance;
                onPressInfo = () => Alert.alert(" SZERVIZECSKE ");
                break;

        }

        return {
            id: expense.id,
            milestone: dayjs(expense.date).format("YYYY. MM DD. hh:mm"),
            title,
            icon,
            color,
            note: expense.note,
            footerText: `${ expense.amount } ${ expense.currency }`,
            onPressInfo
        };
    });

    return { mapper };
};