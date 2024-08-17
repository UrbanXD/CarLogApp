import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    Alert,
    ImageSourcePropType,
    SafeAreaView, ScrollView,
    StyleSheet,
    Text, TouchableHighlight, TouchableOpacity,
    View
} from "react-native";
import {theme} from "../constants/theme";
import CardButton from "../components/Button/CardButton";
import {router} from "expo-router";
import Animated, {FadeInLeft} from "react-native-reanimated";
import HomeHeader from "../layouts/header/HomeHeader";
import {
    DEFAULT_SEPARATOR,
    FONT_SIZES,
    GLOBAL_STYLE,
    ICON_NAMES,
    SEPARATOR_SIZES
} from "../constants/constants";
import {useDatabase} from "../db/Database";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import Carousel, {CarouselItemType} from "../components/Carousel/Carousel";
import {CARS_TABLE} from "../db/AppSchema";
import {getUUID} from "../db/uuid";
import Button from "../components/Button/Button";
import {Icon} from "react-native-paper";
import {getDate} from "../utils/getDate";
import UpcomingRides from "../components/UpcomingRides/UpcomingRides";
import Link from "../components/Link/Link";
import {useDispatch, useSelector} from "react-redux";
import {RootState, store} from "../redux/store";
import {loadCars, addCar as aC} from "../redux/reducers/cars.slices";

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

    const cars = useSelector<RootState, CarouselItemType[]>(state => state.cars.cars);
    const carsID = useSelector<RootState, Array<string>>(state => state.cars.carsID);
    const selectedCarIndex = useSelector<RootState, number>(state => state.cars.selectedCarIndex);
    const isLoading = useSelector<RootState>(state => state.cars.loading);
    const [today] = useState(getDate());

    useEffect(() => {
        store.dispatch(loadCars(db))
    }, [dispatch]);

    const addCar = async () => {
        const { userID } = await supabaseConnector.fetchCredentials();
        const carID = getUUID();

        const car = {
            id: carID,
            owner: userID,
            name: "AFIHNBGVRN",
            brand: "LADA",
            type: "Ori",
            image: null,
            selected: 0
        }
        store.dispatch(aC({ db, car }))
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
    return (
        <SafeAreaView style={ [GLOBAL_STYLE.pageContainer, styles.pageContainer] }>
            <ScrollView
                showsVerticalScrollIndicator={ false }
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
                </Animated.View>
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
                        <Carousel data={ cars } selectedIndex={ selectedCarIndex } itemOnPress={ selectCar } />
                    </View>
                    <Button buttonStyle={{ width: wp(75) }} onPress={addCar} title={"Új autó hozzáadása"} />
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