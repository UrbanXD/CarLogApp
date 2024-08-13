import React, {useState} from "react";
import {Dimensions, Image, SafeAreaView, StyleSheet, Text, View} from "react-native";
import {theme} from "../constants/theme";
import {GLOBAL_STYLE} from "../constants/constants";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import CompetitionHeader from "../layouts/header/CompetitionHeader";
// import {countries} from "countries-list";
import CountryFlag from "react-native-country-flag";

const FuelMonitorScreen: React.FC = () => {
    const { top } = useSafeAreaInsets();
    return (
        <View style={ GLOBAL_STYLE.pageContainer }>
            <CompetitionHeader />
            <View style={ style.contentContainer }>
                {/*<View style={ style.titleContainer }>*/}
                {/*</View>*/}
                <CountryFlag isoCode="HU" size={25} />
                <View style={{
                    flex: 1,
                    // justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: theme.colors.black,
                    borderRadius: 25
                }}>
                    <Text
                        style={{
                            fontSize: 60,
                            color: 'green',
                            fontWeight: 'bold',
                        }}
                    >
                        AsEMMxdI
                    </Text>
                </View>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    contentContainer: {
        flex: 1,
        flexDirection: "column",
        padding: 20,
        // backgroundColor: theme.colors.fuelYellow
    },
    titleContainer: {

    },

})

export default FuelMonitorScreen;