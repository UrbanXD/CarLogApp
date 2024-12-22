import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { theme } from "../../core/constants/theme";
import Animated, { FadeInLeft, SharedValue } from "react-native-reanimated";
import {
    DEFAULT_SEPARATOR,
    FONT_SIZES,
    GLOBAL_STYLE,
    ICON_NAMES,
    SEPARATOR_SIZES
} from "../../core/constants/constants";
import { useDatabase } from "../../core/utils/database/Database";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import Button from "../../core/components/shared/button/Button";
import Carousel, { CarouselItemType } from "../../core/components/shared/carousel/Carousel";
import { getDate } from "../../core/utils/getDate";
import UpcomingRides from "../../upcomingRides/UpcomingRides";
import Link from "../../core/components/shared/Link";
import { useSelector } from "react-redux";
import { RootState, store } from "../../core/redux/store";
import CarouselItem from "../../core/components/shared/carousel/CarouselItem";
import { useBottomSheet} from "../../core/context/BottomSheetProvider";
import NewCarForm from "../../layouts/forms/addCar/NewCarForm";
import { encode } from "base64-arraybuffer";
import CarInfo from "../../carInfo/CarInfo";
import {loadCars} from "../../core/redux/cars/functions/loadCars";

const HomeScreen: React.FC = () => {
    const database = useDatabase();

    useEffect(() => {
        store.dispatch(loadCars(database))
    }, []);
    console.log("homescren rerender")

    return (
        <SafeAreaView style={ [GLOBAL_STYLE.pageContainer, styles.pageContainer] }>
            <ScrollView
                showsVerticalScrollIndicator={ false }
                nestedScrollEnabled={ true }
                contentContainerStyle={ GLOBAL_STYLE.scrollViewContentContainer }
            >
                <WelcomeBlock />
                <CarsBlock />
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
        </Animated.View>
    )
}

const CarsBlock: React.FC = () => {
    const { openBottomSheet, closeBottomSheet } = useBottomSheet();

    const { attachmentQueue } = useDatabase();

    const selectCarsState = (state: RootState) => state.cars.cars;

    const cars = useSelector(selectCarsState);
    const [carouselData, setCarouselData] = useState<CarouselItemType[]>([]);

    const openNewCarBottomSheet = () =>
        openBottomSheet({
            title: "Új Autó",
            content: <NewCarForm close={ closeBottomSheet } />,
            snapPoints: ["85%"]
        })

    const openCarInfoBottomSheet = (index: number) =>
        openBottomSheet({
            title: carouselData[index].id || index.toString(),
            content: <CarInfo car={ cars.find(car => car.id === cars[index].id) } />,
            snapPoints: ["85%"]
        })

    useEffect(() => {
        const mappedCars = cars.map(car => {
            return {
                id: car.name,
                image: car.image,
                title: car.brand,
                subtitle: car.model,
            } as CarouselItemType;
        })

        setCarouselData(mappedCars);
    }, [cars]);

    return (
        <View style={ [GLOBAL_STYLE.contentContainer, { paddingHorizontal: 0, marginHorizontal: 0, backgroundColor: "transparent"}] } >
            <View style={{ paddingHorizontal: DEFAULT_SEPARATOR }}>
                <Text style={ GLOBAL_STYLE.containerTitleText }>
                    Garázs
                </Text>
                <Text style={ GLOBAL_STYLE.containerText }>
                    Válasszon ki egy autót
                </Text>
            </View>
            <View style={ styles.carouselContainer }>
                <Carousel
                    data={ carouselData }
                    renderItem={
                        (item: CarouselItemType, index: number, size: number, coordinate: SharedValue<number>) =>
                            <CarouselItem
                                index={ index }
                                size={ size }
                                x={ coordinate }
                                overlay
                                item={ item }
                                cardAction={ () => openCarInfoBottomSheet(index) }
                            />
                    }
                />
            </View>
            <Button.Text
                text="Autó hozzáadás"
                width={ wp(75) }
                onPress={ openNewCarBottomSheet }
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