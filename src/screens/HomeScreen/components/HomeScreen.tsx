import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, GLOBAL_STYLE } from "../../../constants/index.ts";
import Garage from "../../../features/car/components/Garage.tsx";
import UpcomingRidesBlock from "./UpcomingRidesBlock";
import Divider from "../../../components/Divider";
import LatestExpensesBlock from "./LatestExpensesBlock";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ScreenScrollView } from "../../../components/ScreenScrollView.tsx";
import { useAuth } from "../../../contexts/auth/AuthContext.ts";

const HomeScreen: React.FC = () => {
    const { user } = useAuth();

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
            <Divider
                thickness={ 2.5 }
                size={ wp(75) }
                color={ COLORS.gray4 }
            />
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
    }
});

export default HomeScreen;