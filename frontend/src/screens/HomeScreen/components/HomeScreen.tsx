import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, DEFAULT_SEPARATOR, FONT_SIZES, GLOBAL_STYLE } from "../../../constants/index.ts";
import Garage from "../../../features/car/components/Garage.tsx";
import UpcomingRidesBlock from "./UpcomingRidesBlock";
import Divider from "../../../components/Divider";
import LatestExpensesBlock from "./LatestExpensesBlock";
import { ScreenScrollView } from "../../../components/ScreenScrollView.tsx";
import { useAppSelector } from "../../../hooks/index.ts";
import { getUser } from "../../../features/user/model/selectors/index.ts";

const HomeScreen: React.FC = () => {
    const user = useAppSelector(getUser);

    return (
        <ScreenScrollView>
            <View style={ styles.titleContainer }>
                <Text style={ styles.welcomeText }>
                    Üdv { `${ user?.firstname ?? "" } ${ user?.lastname ?? "" }` }!
                </Text>
                <Text style={ styles.infoText }>
                    Vezzessen számot nálunk az autóiról!
                </Text>
            </View>
            <View style={ styles.dividerContainer }>
                <Divider
                    thickness={ 2.5 }
                    color={ COLORS.gray4 }
                />
            </View>
            <Garage/>
            <UpcomingRidesBlock/>
            <LatestExpensesBlock/>
        </ScreenScrollView>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        ...GLOBAL_STYLE.contentContainer,
        paddingHorizontal: 0,
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
    dividerContainer: {
        marginHorizontal: DEFAULT_SEPARATOR
    }
});

export default HomeScreen;