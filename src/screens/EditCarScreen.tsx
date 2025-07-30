import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { DEFAULT_SEPARATOR, GLOBAL_STYLE, SEPARATOR_SIZES } from "../constants/index.ts";
import { router, useLocalSearchParams } from "expo-router";
import CarProfile from "../features/car/components/carProfile/CarProfile.ts";

const EditCarScreen: React.FC = () => {
    const { id } = useLocalSearchParams();

    if(!id) {
        if(router.canGoBack()) return router.back();
        router.replace("(main)/index");
    }

    return (
        <SafeAreaView style={ styles.pageContainer }>
            <CarProfile.ById carId={ id } fuelSliderDisabled/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    pageContainer: {
        ...GLOBAL_STYLE.pageContainer,
        paddingHorizontal: DEFAULT_SEPARATOR,
        paddingBottom: SEPARATOR_SIZES.small
    }
});

export default EditCarScreen;