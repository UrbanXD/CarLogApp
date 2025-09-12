import React from "react";
import { DEFAULT_SEPARATOR } from "../constants/index.ts";
import { router, useLocalSearchParams } from "expo-router";
import CarProfile from "../features/car/components/carProfile/CarProfile.ts";
import { ScreenScrollView } from "../components/ScreenScrollView.tsx";

const EditCarScreen: React.FC = () => {
    const { id } = useLocalSearchParams();

    if(!id) {
        if(router.canGoBack()) return router.back();
        router.replace("(main)/index");
    }

    return (
        <ScreenScrollView
            screenHasTabBar={ false }
            safeAreaEdges={ ["right", "left"] }
            style={ { paddingHorizontal: DEFAULT_SEPARATOR } }
        >
            <CarProfile.ById carId={ id } fuelSliderDisabled/>
        </ScreenScrollView>
    );
};

export default EditCarScreen;