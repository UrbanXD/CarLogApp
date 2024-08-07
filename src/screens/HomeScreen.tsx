import React from "react";
import {
    Alert,
    Dimensions,
    ImageSourcePropType,
    Platform,
    SafeAreaView, ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import {theme} from "../styles/theme";
import Constants from "expo-constants";
import CardButton from "../components/Button/CardButton";
import {router} from "expo-router";
import Animated, {FadeInLeft} from "react-native-reanimated";
import {countries} from "countries-list";
import fuelAPIService from "../services/fuelAPI.service";
import HomeHeader from "../layouts/header/HomeHeader";
import {DEFAULT_SEPARATOR, FONT_SIZES, GLOBAL_STYLE, SEPARATOR_SIZES} from "../constants/constants";
import {useDatabase} from "../db/Database";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import Carousel from "../components/Carousel/Carousel";

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
    const { supabaseConnector } = useDatabase();

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
                <View style={ styles.myCarsContainer } >
                    <Text style={ [styles.containerTitleText, { paddingHorizontal: DEFAULT_SEPARATOR }] }>
                        Autóim
                    </Text>
                    <View style={ styles.carouselContainer }>
                        <Carousel data={[ <View></View>, <></>, <></>]} />
                        {/*<View style={ styles.carouselItemContainer }>*/}

                        {/*</View>*/}
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