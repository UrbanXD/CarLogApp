import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, DEFAULT_SEPARATOR, FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES } from "../../../constants/index.ts";
import Garage from "../../../features/car/components/Garage.tsx";
import UpcomingRidesBlock from "./UpcomingRidesBlock";
import Divider from "../../../components/Divider";
import { ScreenScrollView } from "../../../components/screenView/ScreenScrollView.tsx";
import { useAppSelector } from "../../../hooks/index.ts";
import { getUser } from "../../../features/user/model/selectors/index.ts";
import { LatestExpenses } from "../../../features/expense/components/LatestExpense.tsx";

const HomeScreen: React.FC = () => {
    const user = useAppSelector(getUser);

    return (
        <ScreenScrollView style={ { paddingHorizontal: 0 } }>
            <View style={ styles.titleContainer }>
                <Text style={ styles.welcomeText }>
                    Üdv { `${ user?.lastname ?? "" } ${ user?.firstname ?? "" }` }!
                </Text>
                <Text style={ styles.infoText }>
                    Vezzessen számot nálunk az autóiról!
                </Text>
            </View>
            <View style={ styles.contentContainer }>
                <Divider
                    thickness={ 2.5 }
                    color={ COLORS.gray4 }
                />
            </View>
            <Garage/>
            <View style={ styles.contentContainer }>
                <UpcomingRidesBlock/>
                <LatestExpenses/>
            </View>
        </ScreenScrollView>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        ...GLOBAL_STYLE.contentContainer,
        paddingHorizontal: DEFAULT_SEPARATOR,
        paddingVertical: 0,
        gap: 0,
        backgroundColor: "transparent"
    },
    welcomeText: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.h2,
        letterSpacing: FONT_SIZES.h2 * 0.045,
        color: COLORS.white,
        textTransform: "uppercase"
    },
    infoText: {
        fontFamily: "Gilroy-Mediun",
        fontSize: FONT_SIZES.p2,
        letterSpacing: FONT_SIZES.p2 * 0.05,
        color: COLORS.gray1
    },
    contentContainer: {
        marginHorizontal: DEFAULT_SEPARATOR,
        gap: SEPARATOR_SIZES.medium
    }
});

export default HomeScreen;