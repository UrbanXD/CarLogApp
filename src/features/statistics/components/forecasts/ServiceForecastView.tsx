import React, { useEffect, useState } from "react";
import { ServiceForecast } from "../../model/dao/statisticsDao.ts";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useTranslation } from "react-i18next";
import { ServiceTypeEnum } from "../../../expense/_features/service/model/enums/ServiceTypeEnum.ts";
import { ServiceForecastCard } from "../ServiceForecastCard.tsx";
import { Section } from "../../../../components/Section.tsx";

type ServiceForecastProps = {
    carId: string
    expandable?: boolean
}

export function ServiceForecastView({ carId, expandable = false }: ServiceForecastProps) {
    const { t } = useTranslation();
    const { statisticsDao } = useDatabase();

    const [forecast, setForecast] = useState<ServiceForecast | null>(null);

    useEffect(() => {
        (async () => {
            setForecast(await statisticsDao.getForecastForService(carId));
        })();
    }, [carId]);

    return (
        <Section
            title={ t("statistics.service.forecast") }
            expandable={ expandable }
        >
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
        </Section>
    );
}