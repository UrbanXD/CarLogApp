import React, { useCallback, useState } from "react";
import { View } from "react-native";
import { MasonryStatView } from "./MasonryStatView.tsx";
import { StatCard } from "./StatCard.tsx";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import useCars from "../../car/hooks/useCars.ts";
import { useFocusEffect } from "expo-router";
import {
    AverageCostPerDistance,
    DistanceTrend,
    ExpenseTrend,
    MonthlyConsumptionData
} from "../model/dao/statisticsDao.ts";
import { SEPARATOR_SIZES } from "../../../constants/index.ts";

export function BasicStatistics() {
    const { statisticsDao } = useDatabase();
    const { selectedCar } = useCars();
    // A StatCard adatok optimális sorrendben és a javasolt dummy tartalommal.
    // Figyelem: A trendeket és az isPositive értékeket a valós logika alapján kell kiszámolni!

    const [fuelCost, setFuelCost] = useState<ExpenseTrend>();
    const [totalCost, setTotalCost] = useState<ExpenseTrend>();
    const [distance, setDistance] = useState<DistanceTrend>();
    const [fuelConsumption, setFuelConsumption] = useState<MonthlyConsumptionData>();
    const [costPerDistance, setCostPerDistance] = useState<MonthlyConsumptionData>();
    const [longestRideDistance, setLongestRideDistance] = useState<DistanceTrend>();

    useFocusEffect(
        useCallback(() => {
            async function a() {
                const [monthlyFuelCost, monthlyTotalCost, monthlyDistance, monthlyFuelConsumption, monthlyCostPerDistance, monthlyLongestRideDistance]: [ExpenseTrend, ExpenseTrend, DistanceTrend, MonthlyConsumptionData, AverageCostPerDistance, DistanceTrend] = await Promise.all(
                    [
                        statisticsDao.getMonthlyFuelCostTrend(selectedCar?.id),
                        statisticsDao.getMonthlyTotalCostTrend(selectedCar?.id),
                        statisticsDao.getMonthlyDistanceTrend(selectedCar?.id),
                        statisticsDao.getMonthlyFuelConsumption(selectedCar?.id),
                        statisticsDao.getMonthlyCostPerDistance(selectedCar?.id),
                        statisticsDao.getMonthlyLongestRideDistance(selectedCar?.id)
                    ]);

                setFuelCost(monthlyFuelCost);
                setTotalCost(monthlyTotalCost);
                setDistance(monthlyDistance);
                setFuelConsumption(monthlyFuelConsumption);
                setCostPerDistance(monthlyCostPerDistance);
                setLongestRideDistance(monthlyLongestRideDistance);
            }

            a();
        }, [selectedCar, statisticsDao])
    );

    const getMonthlyFuelCost = useCallback(() => {
        const diff = fuelCost?.current - fuelCost?.previous;
        const absoluteDiff = Math.abs(diff);
        const formattedDiff = absoluteDiff.toLocaleString("hu-HU", { notation: "compact" });

        const trendSymbol = diff > 0 ? "↑" : (diff < 0 ? "↓" : "=");
        const isTrendPositive = diff < 0;

        return {
            label: "Havi üzemanyagköltség",
            value: `${ fuelCost?.current } ${ selectedCar?.currency.symbol }`,
            trend: `${ trendSymbol } ${ formattedDiff } ${ selectedCar?.currency.symbol }\nelőző hónaphoz képest`,
            isPositive: isTrendPositive
        };
    }, [fuelCost, selectedCar]);

    const getMonthlyTotalCost = useCallback(() => {
        const diff = totalCost?.current - totalCost?.previous;
        const absoluteDiff = Math.abs(diff);
        const formattedDiff = absoluteDiff.toLocaleString("hu-HU", { notation: "compact" });

        const trendSymbol = diff > 0 ? "↑" : (diff < 0 ? "↓" : "=");
        const isTrendPositive = diff < 0;

        return {
            label: "Havi összköltség",
            value: `${ totalCost?.current } ${ selectedCar?.currency.symbol }`,
            trend: `${ trendSymbol } ${ formattedDiff } ${ selectedCar?.currency.symbol }\nelőző hónaphoz képest`,
            isPositive: isTrendPositive
        };
    }, [totalCost, selectedCar]);

    const getMonthlyDistance = useCallback(() => {
        const diff = distance?.current - distance?.previous;
        const absoluteDiff = Math.abs(diff);
        const formattedDiff = absoluteDiff.toLocaleString("hu-HU", { notation: "compact" });

        const trendSymbol = diff > 0 ? "+" : (diff < 0 ? "-" : "");

        return {
            label: "Havi megtett távolság",
            value: `${ distance?.current } ${ selectedCar?.odometer?.unit?.short }`,
            trend: `${ trendSymbol } ${ formattedDiff } ${ selectedCar?.odometer?.unit?.short }\nelőző hónaphoz képest`
        };
    }, [distance, selectedCar]);

    const getMonthlyFuelConsumption = useCallback(() => {
        const diff = fuelConsumption?.current - fuelConsumption?.previous;
        const absoluteDiff = Math.abs(diff);
        const formattedDiff = absoluteDiff.toLocaleString("hu-HU", { notation: "compact" });

        const trendSymbol = diff > 0 ? "↑" : (diff < 0 ? "↓" : "=");
        const isTrendPositive = diff < 0;

        return {
            label: `Átlagfogyasztás\n(100 ${ selectedCar?.odometer.unit.short })`,
            value: `${ fuelConsumption?.current } ${ selectedCar?.fuelTank.unit.short }`,
            trend: `${ trendSymbol } ${ formattedDiff } ${ selectedCar?.fuelTank.unit.short }\nelőző 30 naphoz képest`,
            isPositive: isTrendPositive
        };
    }, [fuelConsumption, selectedCar]);

    const getMonthlyCostPerDistance = useCallback(() => {
        const diff = costPerDistance?.current - costPerDistance?.previous;
        const absoluteDiff = Math.abs(diff);
        const formattedDiff = absoluteDiff.toLocaleString("hu-HU", { notation: "compact" });

        const trendSymbol = diff > 0 ? "↑" : (diff < 0 ? "↓" : "=");
        const isTrendPositive = diff < 0;

        return {
            label: `Átlag költség \n(100 ${ selectedCar?.odometer.unit.short })`,
            value: `${ costPerDistance?.current } ${ selectedCar?.currency.symbol }`,
            trend: `${ trendSymbol } ${ formattedDiff } ${ selectedCar?.currency.symbol }\nelőző 30 naphoz képest`,
            isPositive: isTrendPositive
        };
    }, [costPerDistance, selectedCar]);

    const getMonthlyAverageRideDistance = useCallback(() => {
        return {
            label: "Havi átlag út hosssz",
            value: "250 km",
            trend: "+ 50 km \nelőző hónaphoz képest"
        };
    }, [selectedCar]);

    const getMonthlyAverageRideDuration = useCallback(() => {
        return {
            label: "Havi átlag menetidő",
            value: "2 óra 54 perc",
            trend: "+ 50 km \nelőző hónaphoz képest"
        };
    }, [selectedCar]);

    const getMonthlyLongestRide = useCallback(() => {
        const diff = longestRideDistance?.current - longestRideDistance?.previous;
        const absoluteDiff = Math.abs(diff);
        const formattedDiff = absoluteDiff.toLocaleString("hu-HU", { notation: "compact" });

        const trendSymbol = diff > 0 ? "+" : (diff < 0 ? "-" : "");

        return {
            label: "Havi leghosszabb út",
            value: `${ longestRideDistance?.current } ${ selectedCar?.odometer.unit.short }`,
            trend: `${ trendSymbol } ${ formattedDiff } ${ selectedCar?.odometer.unit.short }\nelőző hónaphoz képest`
        };
    }, [longestRideDistance, selectedCar]);

    const getMonthlyTopPlace = useCallback(() => {
        return {
            label: "Havi felkapott helyek",
            value: "1. Zenta\n2. Szeged\n3. Rona utca 16a Nagyon hosszu ez itt"
        };
    }, [selectedCar]);

    //getMonthlyAverageRideDistance
    //getMonthlyAverageRideDuration
    //getMonthlyLongestRide
    return (
        <View style={ { gap: SEPARATOR_SIZES.lightSmall } }>
            {/*Flottara VONATKOZOK*/ }


            {/*KOCSIRA VONATKOZOK*/ }
            <MasonryStatView
                column1={ [
                    getMonthlyFuelCost(),
                    getMonthlyTotalCost(),
                    getMonthlyDistance()
                ] }
                column2={ [
                    getMonthlyFuelConsumption(),
                    getMonthlyCostPerDistance()
                ] }
            />
            <StatCard label={ "Leggyakoribb Útvonal" } value={ "Otthon ↔ Munka (18×)" }/>
            <MasonryStatView
                column1={ [
                    getMonthlyAverageRideDistance(),
                    getMonthlyAverageRideDuration()
                ] }
                column2={ [
                    getMonthlyLongestRide(),
                    getMonthlyTopPlace()
                ] }
            />
        </View>
    );
}