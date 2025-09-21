import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { TimelineView } from "../../../components/timelineView/TimelineView.tsx";
import { TimelineItemType } from "../../../components/timelineView/item/TimelineItem.tsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { formatNumber } from "../../../utils/formatNumber.ts";
import { OdometerLogType } from "../model/enums/odometerLogType.ts";
import { COLORS, ICON_NAMES } from "../../../constants/index.ts";
import { Alert } from "react-native";
import { OdometerLogTableRow } from "../../../database/connector/powersync/AppSchema.ts";
import useCars from "../hooks/useCars.ts";

type OdometerLogTimelineProps = {
    carId: string
};

export function OdometerLogTimeline({ carId }: OdometerLogTimelineProps) {
    const { odometerDao } = useDatabase();
    const paginator = useMemo(() => odometerDao.odometerLogPaginator(carId, 3), [carId]);
    const { getCar } = useCars();
    const car = useMemo(() => getCar(carId), [carId, getCar]);

    if(!car) return <></>;

    const [data, setData] = useState<Array<TimelineItemType>>([]);

    const odometerLogRowToTimelineItem = useCallback((odometerLogRow: OdometerLogTableRow): TimelineItemType => {
        let title = "Kilométeróra-frissítés";
        let color;
        let icon;
        let onPressInfo;

        switch(odometerLogRow?.type) {
            case OdometerLogType.SIMPLE:
                title = "Kilométeróra-frissítés";
                break;
            case OdometerLogType.FUEL:
                title = "Tankolás";
                icon = ICON_NAMES.fuelPump;
                color = "orange";
                onPressInfo = () => { Alert.alert("fuelocska"); };
                break;
            case OdometerLogType.SERVICE:
                title = "Szervíz";
                icon = ICON_NAMES.serviceOutline;
                color = COLORS.blueLight;
                onPressInfo = () => Alert.alert(" SZERVIZECSKE ");
                break;
        }

        return {
            milestone: `${ formatNumber(odometerLogRow.value) } ${ odometerLogRow.unit }`,
            title,
            icon,
            color,
            note: odometerLogRow.note,
            footerText: dayjs(odometerLogRow.date).format("YYYY. MM DD."),
            onPressInfo
        };
    }, []);

    useEffect(() => {
        paginator.initial().then(result => {
            setData(result.map(odometerLogRowToTimelineItem));
        });
    }, []);

    const fetchMore = useCallback(() => {
        paginator.next().then(result => {
            if(!result) return;

            const newData = result.map(odometerLogRowToTimelineItem);
            setData(prevState => [...prevState, ...newData]);
        });
    }, [paginator]);

    return (
        <TimelineView
            title={ car.name }
            subtitle={ `${ car.model.make.name } ${ car.model.name }` }
            data={ data }
            fetchMore={ fetchMore }
        />
    );
}