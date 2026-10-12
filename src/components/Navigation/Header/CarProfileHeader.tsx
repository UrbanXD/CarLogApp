import React from "react";
import { useTranslation } from "react-i18next";
import SecondaryHeader from "./SecondaryHeader.tsx";

const CarProfileHeader: React.FC = () => {
    const { t } = useTranslation();

    return <SecondaryHeader title={ t("car.title") } showDesktopTitle/>;
};

export default CarProfileHeader;
