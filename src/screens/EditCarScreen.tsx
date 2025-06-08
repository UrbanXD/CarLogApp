import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { DEFAULT_SEPARATOR, GLOBAL_STYLE, SEPARATOR_SIZES } from "../constants/constants";
import { useLocalSearchParams } from "expo-router";
import CarProfile from "../features/CarProfile/components/CarProfile";

const EditCarScreen: React.FC = () => {
    const localSearchParams = useLocalSearchParams();

    return (
        <SafeAreaView style={ styles.pageContainer }>
            <CarProfile carID={ localSearchParams.id as string } />
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