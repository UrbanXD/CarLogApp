import React, {useEffect, useState} from "react";
import {
    ImageSourcePropType,
    SafeAreaView, ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import {theme} from "../styles/theme";
import CardButton from "../components/Button/CardButton";
import {router} from "expo-router";
import Animated, {FadeInLeft} from "react-native-reanimated";
import HomeHeader from "../layouts/header/HomeHeader";
import {DEFAULT_SEPARATOR, FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES} from "../constants/constants";
import {useDatabase} from "../db/Database";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import Carousel, {CarouselItemType} from "../components/Carousel/Carousel";
import {CARS_TABLE, USERS_TABLE} from "../db/AppSchema";
import {getUUID} from "../db/uuid";
import Button from "../components/Button/Button";

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

        loadCars();
    }

    const loadCars = async () => {
        setCars([]);

        const result =
            await db
                .selectFrom(CARS_TABLE)
                .selectAll()
                .execute();

        if (result && result.length > 0) {
            result.sort((a, b) => (b.selected || 0) - (a.selected || 0));

            const cars =
                result.map(car => ({
                    id: car.name || "",
                    title: car.brand || "",
                    subtitle: car.type || "",
                    selected: !!car.selected,
                    image: undefined
                }));

            setCars(cars);
        }
    }
    useEffect(() => {
        loadCars();
    }, []);

    return (
        <SafeAreaView style={ [GLOBAL_STYLE.pageContainer, { backgroundColor: theme.colors.primaryBackground2, marginBottom: 0, paddingHorizontal: 0 }] }>
            <View style={{ paddingHorizontal: DEFAULT_SEPARATOR }}>
                <HomeHeader />
            </View>
            <ScrollView showsVerticalScrollIndicator={ false } contentContainerStyle={ GLOBAL_STYLE.scrollViewContentContainer }>
                <Animated.Text
                    entering={ FadeInLeft.springify(1200) }
                    style={ styles.titleText }
                >
                    Vezzessen számot nálunk az autóiról!
                </Animated.Text>
                <Button onPress={addCar} title={"Add"}></Button>
                <View style={ styles.myCarsContainer } >
                    <View>
                        <Text style={ [styles.containerTitleText, { paddingHorizontal: DEFAULT_SEPARATOR }] }>
                            Autóim
                        </Text>
                        <Text style={ [styles.containerSubtitleText, { paddingHorizontal: DEFAULT_SEPARATOR }] }>
                            Válasszon ki egy autót
                        </Text>
                    </View>
                    <View style={ styles.carouselContainer }>
                        <Carousel data={ cars } />
                    </View>
                </View>
                <View style={ styles.actionButtonsContainer }>
                    <Text style={ styles.containerTitleText }>
                        Szolgáltatások
                    </Text>
                    <View style={ styles.buttonsContainer }>
                        {
                            buttons.map((button, index) =>
                                <CardButton
                                    key={ index }
                                    onPress={ button.router }
                                    title={ button.title }
                                    image={ button.image }
                                />
                            )
                        }
                    </View>
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
            {/*<View style={ styles.buttonsContainer }>*/}
            {/*    {*/}
            {/*        buttons.map((button, index) =>*/}
            {/*            <CardButton*/}
            {/*                key={ index }*/}
            {/*                onPress={ button.router }*/}
            {/*                title={ button.title }*/}
            {/*                image={ button.image }*/}
            {/*            />*/}
            {/*        )*/}
            {/*    }*/}
            {/*</View>*/}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    titleText: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.medium,
        color: theme.colors.white,
        marginHorizontal: SEPARATOR_SIZES.normal,
        textTransform: "uppercase"
    },
    containerTitleText: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.normal,
        color: theme.colors.white
    },
    containerSubtitleText: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.small,
        color: theme.colors.grayLight
    },
    myCarsContainer: {
        gap: SEPARATOR_SIZES.small,
        marginTop: SEPARATOR_SIZES.extraMedium,
    },
    carouselContainer: {
        height: hp(27.5),
        width: "100%",
        // alignItems: "center",
    },
    carouselItemContainer: {
        flex: 1,
        width: "85%",
        backgroundColor: 'blue'
    },
    actionButtonsContainer: {
        paddingHorizontal: DEFAULT_SEPARATOR,
        gap: SEPARATOR_SIZES.small,
        marginTop: SEPARATOR_SIZES.extraMedium
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 15,
        // marginTop: 15,
        // padding: 15,
    }
})

export default HomeScreen;