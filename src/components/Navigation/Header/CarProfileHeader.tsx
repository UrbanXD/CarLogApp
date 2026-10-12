import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { useCar } from "../../../features/car/hooks/useCar.ts";
import SecondaryHeader from "./SecondaryHeader.tsx";

const CarProfileHeader: React.FC = () => {
    const { id } = useLocalSearchParams<{ id?: string | string[] }>();
    const carId = Array.isArray(id) ? id[0] : id;
    const { car } = useCar({ carId });
    const { t } = useTranslation();

    return <SecondaryHeader title={ car?.name ?? t("car.title") } showDesktopTitle/>;
};

export default CarProfileHeader;
