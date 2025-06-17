import React from "react";
import { StyleSheet, View, Text, LayoutChangeEvent } from "react-native";
import { COLORS, FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../../constants";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import Button from "../../../components/Button/Button.ts";

interface OdometerProps {
    value: number | string
    measurement: string
    openEditForm?: () => void
}

const Odometer: React.FC<OdometerProps> = ({
    value,
    measurement,
    openEditForm
}) => {
    const DEFAULT_VALUE_LENGTH = value.toString().length;
    value = value.toString().padStart(6, "0");

    const [odometerContainerWidth, setOdometerContainerWidth] = React.useState(0);
    const onOdometerContainerLayout = (event: LayoutChangeEvent) => {
        setOdometerContainerWidth(event.nativeEvent.layout.width);
    }

    const styles = useStyles(value.length, odometerContainerWidth);
    return (
        <View style={ styles.container }>
            <View style={ styles.titleContainer }>
                <Text style={ styles.titleText }>Kilóméteróra ({ measurement })</Text>
                {
                    openEditForm &&
                    <Button.Icon
                        icon={ ICON_NAMES.pencil }
                        iconSize={ FONT_SIZES.h3 }
                        iconColor={ COLORS.gray1 }
                        width={ FONT_SIZES.h3 }
                        height={ FONT_SIZES.h3 }
                        backgroundColor="transparent"
                        onPress={ openEditForm }
                    />
                }
            </View>
            <View
                style={ styles.odometerContainer }
                onLayout={ onOdometerContainerLayout }
            >
                {
                    value.split("").map((digit, index) => (
                        <View key={ index } style={ styles.digitContainer }>
                            <Text style={ DEFAULT_VALUE_LENGTH < 6 && index < (value.length - DEFAULT_VALUE_LENGTH) ? [styles.backgroundDigitText, { position: "relative" }] : styles.digitText }>{ digit }</Text>
                            <Text style={ styles.backgroundDigitText }>8</Text>
                        </View>
                    ))
                }
            </View>
        </View>
    )
}

const useStyles = (numberOfDigits: number, odometerContainerWidth: number) => StyleSheet.create({
    container: {
        gap: SEPARATOR_SIZES.lightSmall
    },
    titleContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    odometerContainer: {
        flex: 1,
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall,
        alignItems: "center",
        justifyContent: "center"
    },
    titleText: {
        flexShrink: 1,
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p2,
        letterSpacing: FONT_SIZES.p2 * 0.05,
        color: COLORS.gray1,
    },
    digitContainer: {
        height: hp(5),
        width: (odometerContainerWidth / numberOfDigits) - SEPARATOR_SIZES.lightSmall,
        position:"relative",
        backgroundColor: COLORS.gray5,
        alignItems: "center",
        justifyContent: "center"
    },
    digitText: {
        fontFamily: "DSEG7",
        fontSize: FONT_SIZES.p1,
        color: COLORS.gray1,
        zIndex: 1,
    },
    backgroundDigitText: {
        position: "absolute",
        fontFamily: "DSEG7",
        fontSize: FONT_SIZES.p1,
        color: COLORS.gray4,
    }
})

export default Odometer;