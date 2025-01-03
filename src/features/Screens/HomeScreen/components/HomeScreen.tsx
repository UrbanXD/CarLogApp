import React, {useCallback, useEffect, useState} from "react";
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { theme } from "../../../Shared/constants/theme";
import Animated, { FadeInLeft, SharedValue } from "react-native-reanimated";
import {
    DEFAULT_SEPARATOR,
    FONT_SIZES,
    GLOBAL_STYLE,
    ICON_NAMES,
    SEPARATOR_SIZES
} from "../../../Shared/constants/constants";
import { useDatabase } from "../../../Database/connector/Database";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP,
    widthPercentageToDP as wp
} from "react-native-responsive-screen";
import Button from "../../../Button/components/Button";
import Carousel, { CarouselItemType } from "../../../Carousel/components/Carousel";
import { getDate } from "../../../Shared/utils/getDate";
import UpcomingRides from "../../../upcomingRides/UpcomingRides";
import Link from "../../../Shared/components/Link";
import { useSelector } from "react-redux";
import { RootState, store } from "../../../Database/redux/store";
import CarouselItem from "../../../Carousel/components/CarouselItem";
import {useBottomSheet} from "../../../BottomSheet/context/BottomSheetProvider";
import NewCarForm from "../../../Form/layouts/car/addCar/NewCarForm";
import {loadCars} from "../../../Database/redux/cars/functions/loadCars";
import CarInfo from "../../../carInfo/CarInfo";
import DefaultElement from "../../../Shared/components/DefaultElement";
import {useAlert} from "../../../Alert/context/AlertProvider";
import WelcomeBlock from "./WelcomeBlock";
import MyGarageBlock from "./MyGarageBlock";
import UpcomingRidesBlock from "./UpcomingRidesBlock";
import Divider from "../../../Shared/components/Divider";
import LatestExpensesBlock from "./LatestExpensesBlock";

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
                    size={ widthPercentageToDP(75) }
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