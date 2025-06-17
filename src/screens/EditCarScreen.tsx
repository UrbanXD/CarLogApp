import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { DEFAULT_SEPARATOR, GLOBAL_STYLE, SEPARATOR_SIZES } from "../constants/index.ts";
import { useLocalSearchParams } from "expo-router";
import CarProfile from "../features/car/components/carProfile/CarProfile.ts";

const EditCarScreen: React.FC = () => {
    const localSearchParams = useLocalSearchParams();

    return (
        <SafeAreaView style={ styles.pageContainer }>
            <CarProfile.ById carId={ localSearchParams.id as string } />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        ...GLOBAL_STYLE.pageContainer,
        paddingHorizontal: DEFAULT_SEPARATOR,
        paddingBottom: SEPARATOR_SIZES.small
    }
})

export default EditCarScreen;