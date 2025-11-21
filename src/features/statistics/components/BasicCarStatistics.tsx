import React, { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { MasonryStatView } from "./MasonryStatView.tsx";
import { StatCard } from "./StatCard.tsx";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import useCars from "../../car/hooks/useCars.ts";
import { useFocusEffect } from "expo-router";
import { TopListItemStat, TrendStat } from "../model/dao/statisticsDao.ts";
import { COLORS, FONT_SIZES, GLOBAL_STYLE } from "../../../constants/index.ts";
import { secondsToTimeText } from "../../../utils/secondsToTimeDuration.ts";
import { calculateTrend } from "../utils/calculateTrend.ts";
import { useTranslation } from "react-i18next";

export function BasicCarStatistics() {
    const { t } = useTranslation();
    const { statisticsDao } = useDatabase();
    const { selectedCar } = useCars();

    const [fuelCost, setFuelCost] = useState<TrendStat>();
    const [serviceCost, setServiceCost] = useState<TrendStat>();
    const [totalCost, setTotalCost] = useState<TrendStat>();
    const [distance, setDistance] = useState<TrendStat>();
    const [fuelConsumption, setFuelConsumption] = useState<TrendStat>();
    const [costPerDistance, setCostPerDistance] = useState<TrendStat>();
    const [longestRideDistance, setLongestRideDistance] = useState<TrendStat>();
    const [longestRideDuration, setLongestRideDuration] = useState<TrendStat>();
    const [mostVisitedPlaces, setMostVisitedPlaces] = useState<Array<TopListItemStat>>([]);
    const [averageRideDistance, setAverageRideDistance] = useState<TrendStat>();
    const [averageRideDuration, setAverageRideDuration] = useState<TrendStat>();

    useFocusEffect(
        useCallback(() => {
            async function getStatistics() {
                if(!selectedCar) return;

                const [
                    monthlyFuelCost,
                    monthlyServiceCost,
                    monthlyTotalCost,
                    monthlyDistance,
                    monthlyFuelConsumption,
                    monthlyCostPerDistance,
                    monthlyLongestRideDistance,
                    monthlyTopVisitedPlaces,
                    monthlyAverageRideDistance,
                    monthlyAverageRideDuration,
                    monthlyLongestRideDuration
                ] = await Promise.all([
                    statisticsDao.getFuelCostTrend({ carId: selectedCar.id, type: "month" }),
                    statisticsDao.getServiceCostTrend({ carId: selectedCar.id, type: "month" }),
                    statisticsDao.getTotalCostTrend({ carId: selectedCar.id, type: "month" }),
                    statisticsDao.getDistanceTrend({ carId: selectedCar.id, type: "month" }),
                    statisticsDao.getFuelConsumption({ carId: selectedCar.id, type: "month" }),
                    statisticsDao.getCostPerDistance({ carId: selectedCar.id, type: "month" }),
                    statisticsDao.getLongestRideDistance({ carId: selectedCar.id, type: "month" }),
                    statisticsDao.getTopVisitedPlaces({ carId: selectedCar.id, type: "month" }),
                    statisticsDao.getAverageRideDistance({ carId: selectedCar.id, type: "month" }),
                    statisticsDao.getAverageRideDuration({ carId: selectedCar.id, type: "month" }),
                    statisticsDao.getLongestRideDuration({ carId: selectedCar.id, type: "month" })
                ]);

                setFuelCost(monthlyFuelCost);
                setServiceCost(monthlyServiceCost);
                setTotalCost(monthlyTotalCost);
                setDistance(monthlyDistance);
                setFuelConsumption(monthlyFuelConsumption);
                setCostPerDistance(monthlyCostPerDistance);
                setLongestRideDistance(monthlyLongestRideDistance);
                setMostVisitedPlaces(monthlyTopVisitedPlaces);
                setAverageRideDistance(monthlyAverageRideDistance);
                setAverageRideDuration(monthlyAverageRideDuration);
                setLongestRideDuration(monthlyLongestRideDuration);
            }

            getStatistics();
        }, [selectedCar, statisticsDao])
    );

    const getMonthlyFuelCost = useCallback(() => {
        const { trend, trendSymbol, isTrendPositive } = calculateTrend(fuelCost?.current, fuelCost?.previous);

        return {
            label: t("statistics.monthly_fuel_cost"),
            value: `${ fuelCost?.current } ${ selectedCar?.currency.symbol }`,
            trend: `${ trendSymbol } ${ trend }`,
            trendDescription: t("statistics.compared_to_previous_month"),
            isPositive: isTrendPositive
        };
    }, [fuelCost, selectedCar, t]);

    const getMonthlyServiceCost = useCallback(() => {
        const { trend, trendSymbol, isTrendPositive } = calculateTrend(serviceCost?.current, serviceCost?.previous);

        return {
            label: t("statistics.monthly_service_cost"),
            value: `${ serviceCost?.current } ${ selectedCar?.currency.symbol }`,
            trend: `${ trendSymbol } ${ trend }`,
            trendDescription: t("statistics.compared_to_previous_month"),
            isPositive: isTrendPositive
        };
    }, [serviceCost, selectedCar, t]);

    const getMonthlyTotalCost = useCallback(() => {
        const { trend, trendSymbol, isTrendPositive } = calculateTrend(totalCost?.current, totalCost?.previous);

        return {
            label: t("statistics.monthly_total_cost"),
            value: `${ totalCost?.current } ${ selectedCar?.currency.symbol }`,
            trend: `${ trendSymbol } ${ trend }`,
            trendDescription: t("statistics.compared_to_previous_month"),
            isPositive: isTrendPositive
        };
    }, [totalCost, selectedCar, t]);

    const getMonthlyDistance = useCallback(() => {
        const { trend, trendSymbol } = calculateTrend(
            distance?.current,
            distance?.previous,
            { trendSymbols: { positive: "+", negative: "-" } }
        );

        return {
            label: t("statistics.monthly_distance"),
            value: `${ distance?.current } ${ selectedCar?.odometer?.unit?.short }`,
            trend: `${ trendSymbol } ${ trend }`,
            trendDescription: t("statistics.compared_to_previous_month")
        };
    }, [distance, selectedCar, t]);

    const getMonthlyFuelConsumption = useCallback(() => {
        const { trend, trendSymbol, isTrendPositive } = calculateTrend(
            fuelConsumption?.current,
            fuelConsumption?.previous
        );

        return {
            label: t("statistics.fuel_consumption", { unit: selectedCar?.odometer.unit.short }),
            value: `${ fuelConsumption?.current } ${ selectedCar?.fuelTank.unit.short }`,
            trend: `${ trendSymbol } ${ trend }`,
            trendDescription: t("statistics.compared_to_previous_30_days"),
            isPositive: isTrendPositive
        };
    }, [fuelConsumption, selectedCar, t]);

    const getMonthlyCostPerDistance = useCallback(() => {
        const { trend, trendSymbol, isTrendPositive } = calculateTrend(
            costPerDistance?.current,
            costPerDistance?.previous
        );

        return {
            label: t("statistics.cost_per_distance", { unit: selectedCar?.odometer.unit.short }),
            value: `${ costPerDistance?.current } ${ selectedCar?.currency.symbol }`,
            trend: `${ trendSymbol } ${ trend }`,
            trendDescription: t("statistics.compared_to_previous_30_days"),
            isPositive: isTrendPositive
        };
    }, [costPerDistance, selectedCar, t]);

    const getMonthlyAverageRideDistance = useCallback(() => {
        const { trend, trendSymbol } = calculateTrend(
            totalCost?.current,
            totalCost?.previous,
            { trendSymbols: { positive: "+", negative: "-" } }
        );

        return {
            label: t("statistics.avg_ride_distance"),
            value: `${ averageRideDistance?.current } ${ selectedCar?.odometer?.unit?.short }`,
            trend: `${ trendSymbol } ${ trend }`,
            trendDescription: t("statistics.compared_to_previous_month")
        };
    }, [averageRideDistance, selectedCar, t]);

    const getMonthlyAverageRideDuration = useCallback(() => {
        const { trend, trendSymbol } = calculateTrend(
            averageRideDuration?.current,
            averageRideDuration?.previous,
            { diffFormat: null, trendSymbols: { positive: "+", negative: "-" } }
        );

        return {
            label: t("statistics.avg_ride_duration"),
            value: averageRideDuration?.current ? secondsToTimeText(averageRideDuration.current) : "-",
            trend: `${ trendSymbol } ${ trend === 0 ? "-" : secondsToTimeText(Number(trend)) }`,
            trendDescription: t("statistics.compared_to_previous_month")
        };
    }, [averageRideDuration, selectedCar, t]);

    const getMonthlyLongestRide = useCallback(() => {
        const { trend, trendSymbol } = calculateTrend(
            longestRideDistance?.current,
            longestRideDistance?.previous,
            { trendSymbols: { positive: "+", negative: "-" } }
        );

        return {
            label: t("statistics.longest_ride_distance"),
            value: `${ longestRideDistance?.current } ${ selectedCar?.odometer.unit.short }`,
            trend: `${ trendSymbol } ${ trend }`,
            trendDescription: t("statistics.compared_to_previous_month")
        };
    }, [longestRideDistance, selectedCar, t]);

    const getMonthlyLongestRideDuration = useCallback(() => {
        const { trend, trendSymbol } = calculateTrend(
            totalCost?.current,
            totalCost?.previous,
            { diffFormat: null, trendSymbols: { positive: "+", negative: "-" } }
        );

        return {
            label: t("statistics.longest_ride_duration"),
            value: longestRideDuration?.current ? secondsToTimeText(longestRideDuration.current) : "-",
            trend: `${ trendSymbol } ${ trend === 0 ? "-" : secondsToTimeText(Number(trend)) }`,
            trendDescription: t("statistics.compared_to_previous_month")
        };
    }, [longestRideDuration, t]);

    const getMonthlyTopPlace = useCallback(() => {
        let value: React.ReactNode = "-";

        if(mostVisitedPlaces.length > 0) {
            value = (
                <>
                    { mostVisitedPlaces.map((place, index) => (
                        <React.Fragment key={ place.name + index }>
                            { place.name }{ " " }
                            <Text
                                style={ {
                                    fontFamily: "Gilroy-Medium",
                                    fontSize: FONT_SIZES.p3,
                                    color: COLORS.gray1
                                } }
                            >
                                (x{ place.count })
                            </Text>
                            { mostVisitedPlaces.length - 1 !== index && "\n" }
                        </React.Fragment>
                    )) }
                </>
            );
        }

        return {
            label: t("statistics.top_visited_places"),
            value
        };
    }, [mostVisitedPlaces, t]);

    if(!selectedCar) return null;

    return (
        <View style={ GLOBAL_STYLE.contentContainer }>
            <Text style={ GLOBAL_STYLE.containerTitleText }>
                { t("statistics.basic_car_title") }
            </Text>

            <MasonryStatView
                column1={ [
                    getMonthlyFuelCost(),
                    getMonthlyServiceCost(),
                    getMonthlyTotalCost()
                ] }
                column2={ [
                    getMonthlyFuelConsumption(),
                    getMonthlyCostPerDistance()
                ] }
            />

            <StatCard { ...getMonthlyTopPlace() } />

            <MasonryStatView
                column1={ [
                    getMonthlyDistance(),
                    getMonthlyAverageRideDistance(),
                    getMonthlyAverageRideDuration()
                ] }
                column2={ [
                    getMonthlyLongestRide(),
                    getMonthlyLongestRideDuration()
                ] }
            />
        </View>
    );
}