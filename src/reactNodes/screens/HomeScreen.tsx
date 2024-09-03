import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    Alert,
    ImageSourcePropType,
    SafeAreaView, ScrollView,
    StyleSheet,
    Text, TouchableHighlight, TouchableOpacity,
    View,
    Image
} from "react-native";
import {theme} from "../../constants/theme";
import CardButton from "../../components/Button/CardButton";
import {router} from "expo-router";
import Animated, {FadeInLeft, SharedValue} from "react-native-reanimated";
import {
    DEFAULT_SEPARATOR,
    FONT_SIZES,
    GLOBAL_STYLE,
    ICON_NAMES,
    SEPARATOR_SIZES
} from "../../constants/constants";
import {useDatabase} from "../../db/Database";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import Carousel, {CarouselItemType} from "../../components/Carousel/Carousel";
import {CARS_TABLE, CarsType, SERVICE_TABLE, ServiceType} from "../../db/AppSchema";
import {getUUID} from "../../db/uuid";
import Button from "../../components/Button/Button";
import {getDate} from "../../utils/getDate";
import UpcomingRides from "../../components/UpcomingRides/UpcomingRides";
import Link from "../../components/Link/Link";
import {useDispatch, useSelector} from "react-redux";
import {RootState, store} from "../../redux/store";
import {loadCars, addCar as aC} from "../../redux/reducers/cars.slices";
import CustomBottomSheet from "../../components/BottomSheet/BottomSheet";
import {BottomSheetModal} from "@gorhom/bottom-sheet";
import NewCarForm from "../layouts/forms/NewCarForm/NewCarForm";
import CarouselItem from "../../components/Carousel/CarouselItem";
import InputPicker from "../../components/Input/InputPicker/InputPicker";
import {createSelector} from "@reduxjs/toolkit";
interface onButtonPressArgs {
    path: string,
    params?: { [key: string]: string }
}
const onButtonPress = ({ path, params }: onButtonPressArgs) => {
    router.push({
        pathname: path,
        params
    })
}

const HomeScreen: React.FC = () => {
    const { supabaseConnector, db } = useDatabase();
    const dispatch = useDispatch();

    const selectCarsState = (state: RootState) => state.cars.cars;

    const selectCarsForCarousel = createSelector(
        [selectCarsState],
        (cars) => cars.map(car => ({
            id: car.name,
            image: undefined,
            title: car.brand,
            subtitle: car.model,
            selected: car.selected,
        }))
    );

    const cars = useSelector(selectCarsForCarousel);

    const carsID = useSelector<RootState, Array<string>>(state => state.cars.carsID);
    const selectedCarIndex = useSelector<RootState, number>(state => state.cars.selectedCarIndex);
    const isLoading = useSelector<RootState>(state => state.cars.loading);
    const [today] = useState(getDate());

    const onP = async () => {
        const service: ServiceType = {
            id: getUUID(),
            car: "4222d62c-71a8-4f0a-a64a-c0c2bf00b222",
            odometer: "400000",
            price: 50000,
            date: getDate(),
            type: "alt",
            works: JSON.stringify({"xd": "ertek"}),
            mechanic: "rudi",
            comment: "comment"
        }
        // await db.insertInto(SERVICE_TABLE).values(service).execute();
        const xd = await db.selectFrom(SERVICE_TABLE).selectAll().execute()
        xd.map((i, index) => console.log(index))
        // console.log(xd)
    }

    useEffect(() => {
        store.dispatch(loadCars(db))
    }, [dispatch]);

    const addCar = async () => {
        bottomSheetModalRef.current?.present()
    }

    const selectCar = async (index: number) => {
        await db
            .updateTable(CARS_TABLE)
            .set({ selected: 1 })
            .where("id", "=", carsID[index])
            .execute();

        // setCars(
        //     cars.map((car, i) => {
        //         if (index === i ) {
        //             return {
        //                 ...car,
        //                 selected: true
        //             };
        //         } else if(i === selectedCarIndex) {
        //             return {
        //                 ...car,
        //                 selected: false
        //             }
        //         } else {
        //             return car;
        //         }
        //     })
        // );
    }

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    return (
        <SafeAreaView style={ [GLOBAL_STYLE.pageContainer, styles.pageContainer] }>
            <CustomBottomSheet
                ref={ bottomSheetModalRef }
                title={"Új Autó"}
            >
                <NewCarForm
                    close={ bottomSheetModalRef.current?.close }
                />
            </CustomBottomSheet>
            <ScrollView
                showsVerticalScrollIndicator={ false }
                nestedScrollEnabled={ true }
                contentContainerStyle={ GLOBAL_STYLE.scrollViewContentContainer }
            >
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
                    <Button title={"service"} onPress={ onP }/>
                </Animated.View>

                {/*<InputPicker />*/}

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
                                        onPress={function (index: number): void {
                                            console.log("xd")
                                        }}
                                    />
                            }
                        />
                    </View>
                    <Button width={ wp(75) } onPress={addCar} title={"Autó hozzáadás"} />
                </View>
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
            </ScrollView>
            {/*<Text*/}
            {/*    style={{ paddingTop: 100, color: "black", fontSize: 40}}*/}
            {/*    onPress={ async () => {*/}
            {/*        try {*/}
            {/*            await supabaseConnector.client.auth.signOut();*/}
            {/*        } catch (e: any){*/}
            {/*            Alert.alert(e.message)*/}
            {/*        }*/}
            {/*    }}*/}
            {/*>*/}
            {/*    Kijelentkezes*/}
            {/*</Text>*/}
        </SafeAreaView>
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