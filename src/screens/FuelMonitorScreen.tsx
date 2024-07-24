import React from "react";
import {Dimensions, Image, ImageBackground, Platform, Text, View} from "react-native";
import {theme} from "../styles/theme";
import Constants from "expo-constants";
import {white} from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import MaskedView from "@react-native-masked-view/masked-view";
import {useFonts} from "expo-font";
// import {} from "expo-font";
const FuelMonitorScreen: React.FC = () => {
    return (
        <View style={{
            flex:1,
            flexDirection: "column",
            // height: "100%", width: "100%",
            backgroundColor: theme.colors.fuelYellow,
            paddingLeft: 20, paddingRight: 20,
            gap: 100,
            paddingTop: Platform.OS === "android" ? Constants.statusBarHeight * 3 : 0,
            paddingBottom: 20,
        }}>
            <View style={{
                // left: -80,
                // bottom: -100,
                // width: Dimensions.get("window").width,
                height: "30%",
                justifyContent: "flex-end",
                // alignItems: "center",
            }}>
                <Image
                    source={require("../assets/fuel_pump_nozzle.png")}
                    resizeMode={"cover"}
                    style={{
                        position: "absolute",
                        left: -100,
                        width: Dimensions.get("window").width,
                        height: "100%",
                        resizeMode: "contain",
                        transform: [{
                            rotate: "30deg",
                        }, {scale: 1.5}]
                    }}
                />
                <Text
                    style={{
                        alignSelf: "flex-end",
                        // position: "absolute",
                        fontFamily: "Nosifer",
                        textAlign: "center",
                        fontSize: 60,
                        fontWeight: "bold"
                    }}
                >Petrolasssaaa</Text>
            </View>
                <View style={{
                    flex: 1,
                    // justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: theme.colors.primaryBackground1,
                    borderRadius: 25
                }}>
                    <Text
                        style={{
                            fontSize: 60,
                            color: 'green',
                            fontWeight: 'bold',
                        }}
                    >
                        Basxic Mask
                    </Text>
                </View>
        </View>
    )
}

export default FuelMonitorScreen;