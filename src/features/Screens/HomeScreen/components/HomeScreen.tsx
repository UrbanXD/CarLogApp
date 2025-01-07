import React, { useEffect } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
} from "react-native";
import { theme } from "../../../Shared/constants/theme";
import { GLOBAL_STYLE } from "../../../Shared/constants/constants";
import { useDatabase } from "../../../Database/connector/Database";
import { store } from "../../../Database/redux/store";
import { loadCars } from "../../../Database/redux/cars/functions/loadCars";
import WelcomeBlock from "./WelcomeBlock";
import MyGarageBlock from "./MyGarageBlock";
import UpcomingRidesBlock from "./UpcomingRidesBlock";
import Divider from "../../../Shared/components/Divider";
import LatestExpensesBlock from "./LatestExpensesBlock";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const HomeScreen: React.FC = () => {
    const database = useDatabase();

    useEffect(() => {
        store.dispatch(loadCars(database));
    }, []);

    return (
        <SafeAreaView style={ styles.pageContainer }>
            <ScrollView
                showsVerticalScrollIndicator={ false }
                nestedScrollEnabled={ true }
                contentContainerStyle={ GLOBAL_STYLE.scrollViewContentContainer }
            >
                <WelcomeBlock />
                <Divider
                    thickness={ 2.5 }
                    size={ wp(75) }
                    color={ theme.colors.gray4 }
                />
                <MyGarageBlock />
                <UpcomingRidesBlock />
                <LatestExpensesBlock />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        ...GLOBAL_STYLE.pageContainer,
        backgroundColor: theme.colors.black2,
        marginBottom: 0,
        paddingHorizontal: 0
    }
})

export default HomeScreen;