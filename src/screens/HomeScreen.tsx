import React from "react";
import {
    ImageSourcePropType,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from "react-native";
import {theme} from "../styles/theme";
import Constants from "expo-constants";
import CardButton from "../components/CardButton";
import {router} from "expo-router";
import Animated, {FadeInLeft} from "react-native-reanimated";
import {countries} from "countries-list";
import fuelAPIService from "../services/fuelAPI.service";


const style = StyleSheet.create({
    container: {
        // flexDirection: "row",
        width: "100%",
        height: "100%",
        backgroundColor: theme.colors.primaryBackground2,
        paddingTop: Platform.OS === "android" ? Constants.statusBarHeight * 1.5 : 0,
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 15,
        marginTop: 15,
        padding: 15,
    }
})

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
    // console.log("price", fuelAPIService.getGasolinePrice(""))
    // Object.entries(countries).forEach(([countryCode, country]) => {
    //     console.log(`Country code: ${countryCode}`);
    //     console.log(`Country name: ${country.name}`);
    //     console.log(`Country native: ${country.currency[0]}`);
    // });

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
        <SafeAreaView style={ style.container }>
            <Animated.Text
                entering={ FadeInLeft.springify(1200) }
                style={{
                    fontFamily: "GilroyHeavy",
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
        </SafeAreaView>
    )
}

export default HomeScreen;