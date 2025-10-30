import { Car } from "../../../../car/schemas/carSchema.ts";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import React, { useMemo } from "react";
import { useTimelinePaginator } from "../../../../../hooks/useTimelinePaginator.ts";
import { StyleSheet, View } from "react-native";
import { Title } from "../../../../../components/Title.tsx";
import { TimelineView } from "../../../../../components/timelineView/TimelineView.tsx";
import { SEPARATOR_SIZES, SIMPLE_TABBAR_HEIGHT } from "../../../../../constants/index.ts";
import { EXPENSE_TABLE } from "../../../../../database/connector/powersync/tables/expense.ts";
import { useServiceLogTimelineFilter } from "../hooks/useServiceLogTimelineFilter.ts";
import { ExpenseTableRow, ServiceLogTableRow } from "../../../../../database/connector/powersync/AppSchema.ts";
import { ServiceLog } from "../schemas/serviceLogSchema.ts";
import { useServiceLogTimelineItem } from "../hooks/useServiceLogTimelineItem.tsx";

type ServiceLogTimelineProps = {
    car: Car
};

export function ServiceLogTimeline({ car }: ServiceLogTimelineProps) {
    const { serviceLogDao } = useDatabase();
    const { mapper } = useServiceLogTimelineItem(car.currency);
    const paginator = useMemo(() => serviceLogDao.paginator({
        cursor: [
            { table: EXPENSE_TABLE, field: "date", order: "desc" },
            { table: EXPENSE_TABLE, field: "amount", order: "desc" },
            { field: "id" }
        ]
    }, { field: "car_id", operator: "=", value: car.id }, 25), []);

    const {
        data,
        initialFetchHappened,
        isInitialFetching,
        fetchNext,
        isNextFetching,
        fetchPrevious,
        isPreviousFetching,
        filterManagement,
        orderButtons
    } = useTimelinePaginator<ServiceLogTableRow & ExpenseTableRow, ServiceLog>({
        paginator,
        mapper,
        cursorOrderButtons: [
            { table: EXPENSE_TABLE, field: "date", title: "Dátum" },
            { table: EXPENSE_TABLE, field: "amount", title: "Ár" }
        ]
    });
    const { filterButtons } = useServiceLogTimelineFilter({
        filterManagement,
        car
    });


    return (
        <View style={ styles.container }>
            <Title title={ "Szervízkönyv" }/>
            <TimelineView
                data={ data }
                orderButtons={ orderButtons }
                filterButtons={ filterButtons }
                isInitialFetching={ isInitialFetching }
                fetchNext={ initialFetchHappened && paginator.hasNext() && fetchNext }
                fetchPrevious={ initialFetchHappened && paginator.hasPrevious() && fetchPrevious }
                isNextFetching={ isNextFetching }
                isPreviousFetching={ isPreviousFetching }
                style={ { paddingBottom: SIMPLE_TABBAR_HEIGHT } }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: SEPARATOR_SIZES.lightSmall
    }
});