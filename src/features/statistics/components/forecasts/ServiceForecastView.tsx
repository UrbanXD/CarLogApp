import React, { useMemo } from "react";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useTranslation } from "react-i18next";
import { ServiceTypeEnum } from "../../../expense/_features/service/model/enums/ServiceTypeEnum.ts";
import { ServiceForecastCard } from "../ServiceForecastCard.tsx";
import { Section } from "../../../../components/Section.tsx";
import { useWatchedQueryCollection } from "../../../../database/hooks/useWatchedQueryCollection.ts";
import { useCar } from "../../../car/hooks/useCar.ts";
import { ViewStyle } from "../../../../types";

type ServiceForecastProps = {
    carId: string
    expandable?: boolean
    containerStyle?: ViewStyle
}

export function ServiceForecastView({ carId, expandable = false, containerStyle }: ServiceForecastProps) {
    const { t } = useTranslation();
    const { serviceLogDao } = useDatabase();
    const { car } = useCar({ carId });

    const memoizedForecastQuery = useMemo(
        () => serviceLogDao.forecastWatchedQueryCollection(carId),
        [serviceLogDao, carId]
    );
    const { data: forecast, isLoading: isForecastLoading } = useWatchedQueryCollection(memoizedForecastQuery);

    return (
        <Section
            title={ t("statistics.service.forecast") }
            expandable={ expandable }
            containerStyle={ containerStyle }
        >
            <ServiceForecastCard
                forecast={ forecast?.[ServiceTypeEnum.MAJOR_SERVICE] }
                type={ ServiceTypeEnum.MAJOR_SERVICE }
                odometer={ car?.odometer }
                isLoading={ isForecastLoading }
            />
            <ServiceForecastCard
                forecast={ forecast?.[ServiceTypeEnum.SMALL_SERVICE] }
                type={ ServiceTypeEnum.SMALL_SERVICE }
                odometer={ car?.odometer }
                isLoading={ isForecastLoading }
            />
        </Section>
    );
}