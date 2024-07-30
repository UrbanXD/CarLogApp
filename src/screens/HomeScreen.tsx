import React from "react";
import {
    Dimensions,
    ImageSourcePropType,
    Platform,
    SafeAreaView,
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
import {GLOBAL_STYLE} from "../constants/constants";

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
        <View style={ [GLOBAL_STYLE.pageContainer, { backgroundColor: theme.colors.primaryBackground2 }] }>
            <HomeHeader />
            <Animated.Text
                entering={ FadeInLeft.springify(1200) }
                style={{
                    fontFamily: "Gilroy-Heavy",
                    fontSize: 30,
                    color: "whitesmoke",
                    padding: 15,
                    textTransform: "uppercase",
                }}
            >
                Vezzessen számot nálunk az autóiról!
            </Animated.Text>
            <View style={ style.buttonsContainer }>
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
    )
}

const style = StyleSheet.create({
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 15,
        marginTop: 15,
        padding: 15,
    }
})

export default HomeScreen;