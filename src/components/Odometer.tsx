import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { FONT_SIZES, SEPARATOR_SIZES } from "../constants/constants.ts";
import { Colors } from "../constants/colors/index.ts";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

interface OdometerProps {
    value: number | string;
}

const Odometer: React.FC<OdometerProps> = ({ value }) => {
    const DEFAULT_VALUE_LENGTH = value.toString().length;
    value = value.toString().padStart(6, "0");

    const [odometerContainerWidth, setOdometerContainerWidth] = React.useState(0);

    const styles = useStyles(value.length, odometerContainerWidth);
    return (
        <View style={ styles.container } onLayout={(event) => {
            setOdometerContainerWidth(event.nativeEvent.layout.width)
        }}>
            {
                value.split("").map((digit, index) => (
                    <View key={ index } style={ styles.digitContainer }>
                        <Text style={ DEFAULT_VALUE_LENGTH < 6 && index < (value.length - DEFAULT_VALUE_LENGTH) ? [styles.backgroundDigitText, { position: "relative" }] : styles.digitText }>{ digit }</Text>
                        <Text style={ styles.backgroundDigitText }>0</Text>
                    </View>
                ))
            }
        </View>
    )
}

const useStyles = (numberOfDigits: number, odometerContainerWidth: number) => StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall,
        alignItems: "center",
        justifyContent: "center"
    },
    digitContainer: {
        height: hp(5),
        width: (odometerContainerWidth / numberOfDigits) - SEPARATOR_SIZES.lightSmall,
        position:"relative",
        backgroundColor: Colors.gray5,
        alignItems: "center",
        justifyContent: "center"
    },
    digitText: {
        fontFamily: "DSEG7",
        fontSize: FONT_SIZES.p1,
        color: Colors.gray1,
        zIndex: 1,
    },
    backgroundDigitText: {
        position: "absolute",
        fontFamily: "DSEG7",
        fontSize: FONT_SIZES.p1,
        color: Colors.gray4,
    }
})

export default Odometer;