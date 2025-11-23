import React, { useCallback } from "react";
import { TimelineItemType } from "../../../../../components/timelineView/item/TimelineItem.tsx";
import { COLORS } from "../../../../../constants/index.ts";
import { OdometerText } from "../components/OdometerText.tsx";
import dayjs from "dayjs";
import { router } from "expo-router";
import { OdometerLog } from "../schemas/odometerLogSchema.ts";
import { OdometerLogTypeEnum } from "../model/enums/odometerLogTypeEnum.ts";
import { useTranslation } from "react-i18next";

export const useOdometerTimelineItem = () => {
    const { t } = useTranslation();

    const mapper = useCallback((
        odometerLog: OdometerLog,
        callback?: () => void
    ): TimelineItemType => {
        const routerPathTitle = t("log.title");
        let routerPathName = "/odometer/log/[id]";
        let itemId = odometerLog.id;

        switch(odometerLog.type.id) {
            case OdometerLogTypeEnum.FUEL:
                routerPathName = "/expense/fuel/[id]";
                itemId = odometerLog.relatedId;
                break;
            case OdometerLogTypeEnum.SERVICE:
                routerPathName = "/expense/service/[id]";
                itemId = odometerLog.relatedId;
                break;
            case OdometerLogTypeEnum.RIDE:
                routerPathName = "/ride/[id]";
                itemId = odometerLog.relatedId;
                break;
        }

        const onPress = () => {
            if(!itemId) return;

            callback?.();
            router.push({
                pathname: routerPathName,
                params: { id: itemId, title: routerPathTitle }
            });
        };

        return {
            id: odometerLog.id,
            milestone:
                <OdometerText
                    text={ odometerLog.value }
                    unit={ odometerLog.unit.short }
                    textStyle={ { color: COLORS.white } }
                    unitTextStyle={ { color: COLORS.white } }
                />,
            title: t(`odometer.types.${ odometerLog.type.key }`),
            icon: odometerLog.type.icon,
            color: odometerLog.type.primaryColor ?? undefined,
            iconColor: odometerLog.type.secondaryColor ?? undefined,
            note: odometerLog.note,
            footerText: dayjs(odometerLog.date).format("LLL"),
            onPress
        };
    }, [t]);

    return { mapper };
};