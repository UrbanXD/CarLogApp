import React, { useEffect, useState } from "react";
import { ServiceForecast } from "../../model/dao/statisticsDao.ts";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { useTranslation } from "react-i18next";
import { ServiceTypeEnum } from "../../../expense/_features/service/model/enums/ServiceTypeEnum.ts";
import { ServiceForecastCard } from "../ServiceForecastCard.tsx";

type ServiceForecastProps = {
    carId: string
}

export function ServiceForecastView({ carId }: ServiceForecastProps) {
    const { t } = useTranslation();
    const { statisticsDao } = useDatabase();

    const [forecast, setForecast] = useState<ServiceForecast | null>(null);

    useEffect(() => {
        (async () => {
            if(!carId) return;

            setForecast(await statisticsDao.getForecastForService(carId));
        })();
    }, [carId]);

    return (
        <View style={ styles.container }>
            <Text style={ styles.title }>
                { t("statistics.service.forecast") }
            </Text>
            <ServiceForecastCard
                forecast={ forecast?.major }
                type={ ServiceTypeEnum.MAJOR_SERVICE }
                odometer={ forecast?.odometer }
                isLoading={ !forecast }
            />
            <ServiceForecastCard
                forecast={ forecast?.small }
                type={ ServiceTypeEnum.SMALL_SERVICE }
                odometer={ forecast?.odometer }
                isLoading={ !forecast }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: GLOBAL_STYLE.contentContainer,
    header: {
        gap: SEPARATOR_SIZES.lightSmall / 2
    },
    title: GLOBAL_STYLE.containerTitleText,
    subtitleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: SEPARATOR_SIZES.lightSmall
    },
    subtitle: {
        fontSize: FONT_SIZES.p2,
        color: COLORS.gray1
    },
    subtitleDate: {
        fontSize: FONT_SIZES.p3,
        // lineHeight: FONT_SIZES.p3 * 1.2,
        // letterSpacing: FONT_SIZES.p3 * 0.05,
        color: COLORS.gray1
    },
    card: {
        flex: 1,
        justifyContent: "space-between",
        padding: SEPARATOR_SIZES.small,
        borderRadius: 12,
        backgroundColor: COLORS.gray5,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 12
        },
        shadowOpacity: 0.58,
        shadowRadius: 16,
        elevation: 24
    },
    cardTitleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: SEPARATOR_SIZES.lightSmall
    },
    cardTitle: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p2,
        color: COLORS.white
    },
    cardDate: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3,
        color: COLORS.gray1
    },
    cardForecast: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.h3,
        color: COLORS.white
    }
});