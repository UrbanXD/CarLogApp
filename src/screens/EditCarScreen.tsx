import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import CarProfile from "../features/car/components/carProfile/CarProfile.ts";
import { ScreenScrollView } from "../components/screenView/ScreenScrollView.tsx";

const EditCarScreen: React.FC = () => {
    const { id } = useLocalSearchParams<{ id: string }>();

    useEffect(() => {
        if(!id) {
            if(router.canGoBack()) return router.back();
            return router.replace("(main)/index");
        }
    }, [id]);

    if(!id) return <></>;

    return (
        <ScreenScrollView screenHasTabBar={ false }>
            <CarProfile.ById carId={ id } fuelSliderDisabled/>
        </ScreenScrollView>
    );
};

export default EditCarScreen;