import React, { useEffect } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { Colors } from "../../../constants/colors";
import { GLOBAL_STYLE } from "../../../constants/constants";
import { useDatabase } from "../../../features/Database/connector/Database";
import { store } from "../../../features/Database/redux/store";
import { loadCars } from "../../../features/Database/redux/cars/functions/loadCars";
import WelcomeBlock from "./WelcomeBlock";
import MyGarageBlock from "./MyGarageBlock";
import UpcomingRidesBlock from "./UpcomingRidesBlock";
import Divider from "../../../components/Divider";
import LatestExpensesBlock from "./LatestExpensesBlock";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ScreenScrollView } from "../../../features/ScreenScrollView/components/ScreenScrollView.tsx";

const HomeScreen: React.FC = () => {
    const database = useDatabase();

    useEffect(() => {
        store.dispatch(loadCars(database));
    }, []);

    return (
        <ScreenScrollView>
            <WelcomeBlock />
            <Divider
                thickness={ 2.5 }
                size={ wp(75) }
                color={ Colors.gray4 }
            />
            <MyGarageBlock />
            <UpcomingRidesBlock />
            <LatestExpensesBlock />
        </ScreenScrollView>
    )
}

export default HomeScreen;