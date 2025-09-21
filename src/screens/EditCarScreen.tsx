import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import CarProfile from "../features/car/components/carProfile/CarProfile.ts";
import { ScreenScrollView } from "../components/ScreenScrollView.tsx";

const EditCarScreen: React.FC = () => {
    const { id } = useLocalSearchParams();

    if(!id) {
        if(router.canGoBack()) return router.back();
        return router.replace("(main)/index");
    }

    return (
        <ScreenScrollView screenHasTabBar={ false }>
            <CarProfile.ById carId={ id } fuelSliderDisabled/>
        </ScreenScrollView>
    );
};

export default EditCarScreen;