import React, {ReactElement, useCallback, useEffect, useRef, useState} from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { theme } from "../constants/theme";
import Animated, { FadeInLeft, SharedValue } from "react-native-reanimated";
import {
    DEFAULT_SEPARATOR,
    FONT_SIZES,
    GLOBAL_STYLE,
    ICON_NAMES,
    SEPARATOR_SIZES
} from "../constants/constants";
import { useDatabase } from "../utils/database/Database";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import Carousel, { CarouselItemType } from "../components/carousel/Carousel";
import Button from "../components/shared/Button";
import { getDate } from "../utils/getDate";
import UpcomingRides from "../../upcomingRides/UpcomingRides";
import Link from "../components/shared/Link";
import { useSelector } from "react-redux";
import { RootState, store } from "../redux/store";
import { loadCars } from "../../form/redux/cars/cars.slices";
import CustomBottomSheet from "../components/shared/BottomSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import NewCarForm from "../../form/layouts/newCarForm/components/NewCarForm";
import CarouselItem from "../components/carousel/CarouselItem";
import { createSelector } from "@reduxjs/toolkit";
import {useBottomSheet} from "../context/BottomSheetProvider";
import InputSlider from "../../form/components/InputSlider";
import InputImagePicker from "../../form/components/InputImagePicker";

const HomeScreen: React.FC = () => {
    const { db } = useDatabase();
    const { openBottomSheet, closeBottomSheet } = useBottomSheet();

    useEffect(() => {
        store.dispatch(loadCars(db))
    }, []);
    console.log("homescren rerender")
    // const onP = async () => {
    //     const service: ServiceType = {
    //         id: getUUID(),
    //         car: "4222d62c-71a8-4f0a-a64a-c0c2bf00b222",
    //         odometer: "400000",
    //         price: 50000,
    //         date: getDate(),
    //         type: "alt",
    //         works: JSON.stringify({"xd": "ertek"}),
    //         mechanic: "rudi",
    //         comment: "comment"
    //     }
    //     // await db.insertInto(SERVICE_TABLE).values(service).execute();
    //     const xd = await db.selectFrom(SERVICE_TABLE).selectAll().execute()
    //     xd.map((i, index) => console.log(index))
    //     // console.log(xd)
    // }

    return (
        <SafeAreaView style={ [GLOBAL_STYLE.pageContainer, styles.pageContainer] }>
            {/*<CustomBottomSheet*/}
            {/*    ref={ bottomSheetModalRef }*/}
            {/*    title={ bottomSheetTitle }*/}
            {/*    snapPoints={ ["85%"] }*/}
            {/*>*/}
            {/*    { bottomSheetContent }*/}
            {/*</CustomBottomSheet>*/}
            <ScrollView
                showsVerticalScrollIndicator={ false }
                nestedScrollEnabled={ true }
                contentContainerStyle={ GLOBAL_STYLE.scrollViewContentContainer }
            >
                <WelcomeBlock />
                <CarsBlock
                    openNewCarBottomSheet={
                        () =>
                            openBottomSheet({
                                title: "Új Autó",
                                content: <NewCarForm close={ closeBottomSheet } />,
                                snapPoints: ["85%"]
                            })
                    }
                />
                <UpcomingRidesBlock />
                <LatestExpensesBlock />
            </ScrollView>
        </SafeAreaView>
    )
}

const WelcomeBlock: React.FC = () => {
    return (
        <Animated.View
            entering={ FadeInLeft.springify(1200) }
            style={ styles.titleContainer }
        >
            <Text style={ styles.welcomeText }>
                Üdv Urbán Ádám!
            </Text>
            <Text style={ styles.infoText }>
                Vezzessen számot nálunk az autóiról!
            </Text>
            <InputImagePicker />
        </Animated.View>
    )
}

interface CarsBlockProps {
    openNewCarBottomSheet: () => void
}
const CarsBlock: React.FC<CarsBlockProps> = ({ openNewCarBottomSheet }) => {
    const selectCarsState = (state: RootState) => state.cars.cars;
    const selectCarsForCarousel = createSelector(
        [selectCarsState],
        (cars) =>
            cars.map(car => ({
                id: car.name,
                image: undefined,
                title: car.brand,
                subtitle: car.model,
            }))
    );
    const cars = useSelector(selectCarsForCarousel);

    return (
        <View style={ [GLOBAL_STYLE.contentContainer, { paddingHorizontal: 0, marginHorizontal: 0, backgroundColor: "transparent"}] } >
            <View style={{ paddingHorizontal: DEFAULT_SEPARATOR }}>
                <Text style={ GLOBAL_STYLE.containerTitleText }>
                    Autóim
                </Text>
                <Text style={ GLOBAL_STYLE.containerText }>
                    Válasszon ki egy autót
                </Text>
            </View>
            <View style={ styles.carouselContainer }>
                <Carousel
                    data={ cars }
                    renderItem={
                        (item: CarouselItemType, index: number, size: number, coordinate: SharedValue<number>) =>
                            <CarouselItem
                                index={ index }
                                size={ size }
                                x={ coordinate }
                                isFocused={ false }
                                item={ item }
                                onPress={function (): void {
                                    console.log("xd")
                                }}
                            />
                    }
                />
            </View>
            <Button
                width={ wp(75) }
                onPress={ openNewCarBottomSheet }
                title={"Autó hozzáadás"}
            />
        </View>
    )
}

const UpcomingRidesBlock: React.FC = () => {
    const [today] = useState(getDate());

    return (
        <View style={ GLOBAL_STYLE.contentContainer }>
            <View>
                <Text style={ GLOBAL_STYLE.containerTitleText }>
                    Legközelebbi utak
                </Text>
                <Text style={ GLOBAL_STYLE.containerText }>
                    { today } (ma)
                </Text>
            </View>
            <ScrollView contentContainerStyle={ GLOBAL_STYLE.scrollViewContentContainer }>
                <UpcomingRides
                    rides={[
                        {
                            carUID: "1",
                            carOwnerUID: "1",
                            dateTitle: "08.26",
                            dateSubtitle: "Hétfő",
                            time: "05:00",
                            locations: [{city: "Zenta", place: "Nagy Abonyi Vince 24."}, {city: "Kamenica", place: "Korhaz utca 15."}],
                            client: "Kiss Imre",
                            passengerCount: 2,
                            comment: ""
                        },
                        {
                            carUID: "2",
                            carOwnerUID: "2",
                            dateTitle: "08.26",
                            dateSubtitle: "Hétfő",
                            time: "05:00",
                            locations: [{city: "Zenta", place: "Nagy Abonyi Vince 24."}, {city: "Kamenica", place: "Korhaz utca 15."}],
                            client: "Kiss Imre affnenkgrsgk n",
                            passengerCount: 2,
                            comment: ""
                        }
                    ]}
                />
            </ScrollView>
            <Link text="További utak" icon={ ICON_NAMES.rightArrowHead } />
        </View>
    )
}

const LatestExpensesBlock: React.FC = () => {
    return (
        <View style={ GLOBAL_STYLE.contentContainer }>
            <Text style={ GLOBAL_STYLE.containerTitleText }>
                Legutóbbi kiadások
            </Text>
            <View style={ GLOBAL_STYLE.rowContainer }>

            </View>
            <View style={ GLOBAL_STYLE.rowContainer }>

            </View>
            <View style={ GLOBAL_STYLE.rowContainer }>

            </View>
            <Link text="További kiadások" icon={ ICON_NAMES.rightArrowHead } />
        </View>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        backgroundColor: theme.colors.black2,
        marginBottom: 0,
        paddingHorizontal: 0
    },
    titleContainer: {
        paddingHorizontal: SEPARATOR_SIZES.normal
    },
    welcomeText: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.medium,
        letterSpacing: FONT_SIZES.medium * 0.045,
        color: theme.colors.white,
        textTransform: "uppercase"
    },
    infoText: {
        fontFamily: "Gilroy-Mediun",
        fontSize: FONT_SIZES.normal * 0.85,
        letterSpacing: FONT_SIZES.normal * 0.85 * 0.05,
        color: theme.colors.gray1
    },
    carouselContainer: {
        height: hp(27.5),
    },
    c: {
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall
    },
    dateContainer: {
        width: hp(11),
        justifyContent: "center",
        alignItems: "center"
    },
})

export default HomeScreen;