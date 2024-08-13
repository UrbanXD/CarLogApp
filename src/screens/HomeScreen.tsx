import React, {useCallback, useEffect, useRef, useState} from "react";
import {
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
    GET_ICON_BUTTON_RESET_STYLE,
    GLOBAL_STYLE,
    ICON_NAMES,
    SEPARATOR_SIZES
} from "../constants/constants";
import {useDatabase} from "../db/Database";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import Carousel, {CarouselItemType} from "../components/Carousel/Carousel";
import {CARS_TABLE, USERS_TABLE} from "../db/AppSchema";
import {getUUID} from "../db/uuid";
import Button from "../components/Button/Button";
import {Icon, IconButton} from "react-native-paper";
import {addLeadingZero, getDate} from "../utils/getDate";
import {white} from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import RideInfo from "../components/UpcomingRides/RideInfo";
import UpcomingRides from "../components/UpcomingRides/UpcomingRides";
import BottomSheet, {BottomSheetMethods} from "../components/BottomSheet/BottomSheet";

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

    const [cars, setCars] = useState<Array<CarouselItemType>>([]);
    const [selectedCarIndex, setSelectedCarIndex] = useState<number>(0);
    const [carsID, setCarsID] = useState<Array<string>>([]);
    const [today] = useState(getDate());

    type buttonsProps =
        Array<{
            router: () => void,
            title: string,
            image: ImageSourcePropType
        }>

    const buttons: buttonsProps = [
        {
            router: () => onButtonPress({ path: "/(competitions)" }),
            title: "Fuvarok",
            image: require("../assets/workbook.png")
        },
        {
            router: () => onButtonPress({ path: "/(competitions)" }),
            title: "Szervíz könyv",
            image: require("../assets/service-book.png")
        },
        {
            router: () => onButtonPress({ path: "/(competitions)" }),
            title: "Kiadások",
            image: require("../assets/expenses.png")
        },
        {
            router: () => onButtonPress({ path: "/fuelMonitor" }),
            title: "Üzemeanyag Árak",
            image: require("../assets/gas_pump.png")
        }
    ];

    const addCar = async () => {
        const { userID } = await supabaseConnector.fetchCredentials();
        const carID = getUUID();

        await db.insertInto(CARS_TABLE).values({
            id: carID,
            owner: userID,
            name: "Azonosito",
            brand: "Brand",
            type: "Tipus",
            image: null,
            selected: 0
        }).execute()

        const newCar: CarouselItemType = {
            id: "Azonosito",
            title: "Brand",
            subtitle: "Tipus",
            selected: !!0
        }

        setCars(prevState => [...prevState, newCar])
    }

    const loadCars = async () => {
        const result =
            await db
                .selectFrom(CARS_TABLE)
                .selectAll()
                .execute();

        if (result && result.length > 0) {
            // result.sort((a, b) => (b.selected || 0) - (a.selected || 0));

            const cars =
                result.map((car, index) => {
                    setCarsID(prevState => [...prevState, car.id]);
                    if(!!car.selected) setSelectedCarIndex(index);

                    return ({
                        id: car.name || "",
                        title: car.brand || "",
                        subtitle: car.type || "",
                        selected: !!car.selected,
                        image: undefined
                    })
                });

            setCars(cars);
        }
    }
    useEffect(() => {
        loadCars();
    }, []);

    const selectCar = async (index: number) => {
        await db
            .updateTable(CARS_TABLE)
            .set({ selected: 1 })
            .where("id", "=", carsID[index])
            .execute();

        setCars(
            cars.map((car, i) => {
                if (index === i ) {
                    return {
                        ...car,
                        selected: true
                    };
                } else if(i === selectedCarIndex) {
                    return {
                        ...car,
                        selected: false
                    }
                } else {
                    return car;
                }
            })
        );
    }

    useEffect(() => {
        const index = cars.findLastIndex(car => car.selected === true);
        setSelectedCarIndex(index || 0)
    }, [cars]);


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
                <View style={ [styles.contentContainer, { paddingHorizontal: 0, marginHorizontal: 0, backgroundColor: "transparent"}] } >
                    <View style={{ paddingHorizontal: DEFAULT_SEPARATOR }}>
                        <Text style={ styles.containerTitleText }>
                            Autóim
                        </Text>
                        <Text style={ styles.containerSubtitleText }>
                            Válasszon ki egy autót
                        </Text>
                    </View>
                    <View style={ styles.carouselContainer }>
                        <Carousel data={ cars } selectedIndex={ selectedCarIndex } itemOnPress={ selectCar } />
                    </View>
                    <Button buttonStyle={{ width: wp(75) }} onPress={addCar} title={"Új autó hozzáadása"} />
                </View>
                <View style={ styles.contentContainer }>
                    <View>
                        <Text style={ styles.containerTitleText }>
                            Legközelebbi utak
                        </Text>
                        <Text style={ styles.containerSubtitleText }>
                            { today } (ma)
                        </Text>
                    </View>
                    <ScrollView style={ GLOBAL_STYLE.scrollViewContentContainer }>
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
                                    client: "Kiss Imre",
                                    passengerCount: 2,
                                    comment: ""
                                }
                            ]}
                        />
                    </ScrollView>
                    <TouchableOpacity style={ styles.linkContainer }>
                        <Text style={ styles.linkText }>
                            További utak
                        </Text>
                        <Icon source={ ICON_NAMES.rightArrowHead } size={ styles.linkText.fontSize * 1.35 } color={ styles.linkText.color } />
                    </TouchableOpacity>
                </View>
                <View style={ styles.contentContainer }>
                    <Text style={ styles.containerTitleText }>
                        Legutóbbi kiadások
                    </Text>
                    <View style={ styles.rowContainer }>

                    </View>
                    <View style={ styles.rowContainer }>

                    </View>
                    <View style={ styles.rowContainer }>

                    </View>
                    <TouchableOpacity style={ styles.linkContainer }>
                        <Text style={ styles.linkText }>
                            További kiadások
                        </Text>
                        <Icon source={ ICON_NAMES.rightArrowHead } size={ styles.linkText.fontSize * 1.35 } color={ styles.linkText.color } />
                    </TouchableOpacity>
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
    contentContainer: {
        gap: SEPARATOR_SIZES.small,
        flexDirection: "column",
        marginTop: SEPARATOR_SIZES.extraMedium,
        paddingHorizontal: DEFAULT_SEPARATOR,
        marginHorizontal: DEFAULT_SEPARATOR,
        backgroundColor: theme.colors.black4,
        padding: 20,
        borderRadius: 35
    },
    containerTitleText: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.normal,
        letterSpacing: FONT_SIZES.normal * 0.05,
        color: theme.colors.white
    },
    containerSubtitleText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.small,
        letterSpacing: FONT_SIZES.small * 0.035,
        color: theme.colors.gray1
    },
    carouselContainer: {
        height: hp(27.5),
    },
    linkContainer: {
        flexDirection: "row",
        justifyContent: "center"
    },
    linkText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.small * 1.15,
        textAlign: "center",
        color: theme.colors.fuelYellow,
    },
    c: {
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall
    },
    rowContainer: {
        flex: 1,
        flexDirection: "row",
        height: hp(8.5),
        backgroundColor: theme.colors.black2,
        borderRadius: 15,
        padding: SEPARATOR_SIZES.small
    },
    rowContainerExtra: {
        height: hp(25)
    },
    dateContainer: {
        width: hp(11),
        justifyContent: "center",
        alignItems: "center"
    },
})

export default HomeScreen;