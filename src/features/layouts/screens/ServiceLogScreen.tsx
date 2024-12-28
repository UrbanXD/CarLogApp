import React from "react";
import { FONT_SIZES, GLOBAL_STYLE } from "../../core/constants/constants";
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { theme } from "../../core/constants/theme";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { formatNumber } from "../../core/utils/formatNumber";
import Divider from "../../core/components/shared/Divider";

const ServiceLogScreen: React.FC = () => {
    const logs = [
        {
            year: 2024,
            dateText: "08.24",
            km: 3000000,
            description: "Olaj csere meg minden nagyon jo dologo ami lehet tett",
            price: 10244666660,
            currencyText: "din"
        },
        {
            year: 2024,
            dateText: "08.25",
            km: 30650,
            description: "Olaj csere",
            price: 1000,
            currencyText: "din"
        }
    ]

    return (
        <SafeAreaView style={ [GLOBAL_STYLE.pageContainer, styles.pageContainer] }>
            <ScrollView
                showsVerticalScrollIndicator={ false }
                contentContainerStyle={ GLOBAL_STYLE.scrollViewContentContainer }
            >
                <View style={ [GLOBAL_STYLE.contentContainer, { height: hp(60), justifyContent: "space-between" }] }>
                    <View>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <Text style={ GLOBAL_STYLE.containerTitleText }>
                                Szervízkönyv
                            </Text>
                            <Text style={ [GLOBAL_STYLE.containerTitleText] }>
                                2024
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <Text style={ GLOBAL_STYLE.containerText }>
                                Search
                            </Text>
                            <Text style={ GLOBAL_STYLE.containerText }>
                                Datum nov / csokk
                            </Text>
                        </View>
                    </View>
                    <Divider />
                    <ScrollView
                        showsVerticalScrollIndicator={ false }
                        contentContainerStyle={ [GLOBAL_STYLE.scrollViewContentContainer, { gap: GLOBAL_STYLE.contentContainer.gap }] }
                    >
                        {
                            logs.map((log, index) => {
                                return (
                                    <View key={ index } style={ [GLOBAL_STYLE.rowContainer, styles.rowContainer] }>
                                        <View style={ [GLOBAL_STYLE.columnContainer, { flex: 0.45 }] }>
                                            <Text style={ [GLOBAL_STYLE.containerTitleText] }>
                                                { log.dateText }
                                            </Text>
                                            <Text style={ [GLOBAL_STYLE.containerText, styles.kilometerText ]}>
                                                { formatNumber(log.km) } km
                                            </Text>
                                        </View>
                                        <View style={ GLOBAL_STYLE.columnContainer }>
                                            <Text numberOfLines={ 2 } style={ [GLOBAL_STYLE.containerText, styles.descriptionText] }>
                                                { log.description }
                                            </Text>
                                            <Text numberOfLines={ 1 } style={ [GLOBAL_STYLE.containerText, styles.priceText] }>
                                                { formatNumber(log.price) } { log.currencyText }
                                            </Text>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    pageContainer: {
        backgroundColor: theme.colors.black2,
        marginBottom: 0,
        paddingHorizontal: 0
    },
    rowContainer: {
        height: hp(11),
    },
    kilometerText: {
        fontSize: FONT_SIZES.tiny,
        textAlign: "center",
    },
    descriptionText: {
        fontFamily: "Gilroy-Heavy",
        color: theme.colors.white,
        textAlign: "center",
        letterSpacing: Platform.OS === "android" ? 0 : 0.4
    },
    priceText: {
        textAlign: "center",
        letterSpacing: Platform.OS === "android" ? 0 : 0.4
    }
})

export default ServiceLogScreen;