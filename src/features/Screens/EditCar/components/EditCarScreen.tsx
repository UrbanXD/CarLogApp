import React from "react";
import {SafeAreaView, ScrollView, StyleSheet} from "react-native";
import {DEFAULT_SEPARATOR, GLOBAL_STYLE} from "../../../Shared/constants/constants";
import {theme} from "../../../Shared/constants/theme";
import {router, useGlobalSearchParams, useLocalSearchParams} from "expo-router";
import CarInfo from "../../../carInfo/CarInfo";
import {useBottomSheet} from "../../../BottomSheet/context/BottomSheetProvider";

const EditCarScreen: React.FC = () => {
    const localSearchParams = useLocalSearchParams();
    const car = JSON.parse(localSearchParams.car as string) || null;
    const { openBottomSheet, forceCloseBottomSheet } = useBottomSheet();

    return (
        <SafeAreaView style={ styles.pageContainer }>
            {/*<ScrollView*/}
            {/*    showsVerticalScrollIndicator={ false }*/}
            {/*    nestedScrollEnabled={ true }*/}
            {/*    contentContainerStyle={ GLOBAL_STYLE.scrollViewContentContainer }*/}
            {/*>*/}
                <CarInfo car={ car } openBottomSheet={ openBottomSheet } forceCloseBottomSheet={ forceCloseBottomSheet }></CarInfo>
            {/*</ScrollView>*/}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        ...GLOBAL_STYLE.pageContainer,
        backgroundColor: theme.colors.black2,
        marginBottom: 0,
        paddingHorizontal: DEFAULT_SEPARATOR,
        paddingBottom: 0
    }
})

export default EditCarScreen;