import { Car } from "../../../../car/schemas/carSchema.ts";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import React, { useCallback, useMemo } from "react";
import { useTimelinePaginator } from "../../../../../hooks/useTimelinePaginator.ts";
import { StyleSheet, View } from "react-native";
import { TimelineView } from "../../../../../components/timelineView/TimelineView.tsx";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES, SIMPLE_TABBAR_HEIGHT } from "../../../../../constants/index.ts";
import { EXPENSE_TABLE } from "../../../../../database/connector/powersync/tables/expense.ts";
import { useServiceLogTimelineFilter } from "../hooks/useServiceLogTimelineFilter.ts";
import { ExpenseTableRow, ServiceLogTableRow } from "../../../../../database/connector/powersync/AppSchema.ts";
import { ServiceLog } from "../schemas/serviceLogSchema.ts";
import { useServiceLogTimelineItem } from "../hooks/useServiceLogTimelineItem.tsx";
import { YearPicker } from "../../../../../components/Input/_presets/YearPicker.tsx";
import { sql } from "@powersync/kysely-driver";
import { Title } from "../../../../../components/Title.tsx";

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

    const setYearFilter = useCallback((year: string) => {
        // @formatter:off
        const customSql = (fieldRef: string) => sql<number>`strftime('%Y', ${ fieldRef })`;
        // @formatter:on
        filterManagement.replaceFilter("year", {
            table: EXPENSE_TABLE,
            field: "date",
            operator: "=",
            value: year,
            customSql
        });
    }, [filterManagement])

    return (
        <View style={ styles.container }>
            <View style={ styles.headerContainer }>
                <Title
                    title={ "Szervízkönyv" }
                    containerStyle={ styles.headerContainer.titleContainer }
                />
                <YearPicker
                    containerStyle={ styles.headerContainer.yearPicker }
                    textInputStyle={ styles.headerContainer.yearPicker.label }
                    inputPlaceholder={ "Év" }
                    hiddenBackground={ true }
                    setValue={ setYearFilter }
                />
            </View>
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
        gap: SEPARATOR_SIZES.lightSmall
    },
    headerContainer: {
        flex: 1,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "flex-start",

        titleContainer: {
            flexShrink: 1
        },

        yearPicker: {
            minHeight: 0,
            height: FONT_SIZES.p1,

            label: {
                fontFamily: "Gilroy-Heavy",
                color: COLORS.white
            }
        }
    }
});