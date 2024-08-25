import React from "react";
import {SharedValue, useAnimatedProps, useDerivedValue} from "react-native-reanimated";
import {theme} from "../../constants/theme";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import {View, Text as TextRN, StyleSheet} from "react-native";
import {Canvas, Skia, Path, Text, SkFont} from "@shopify/react-native-skia";
import {FONT_SIZES, SEPARATOR_SIZES} from "../../constants/constants";

interface ProgressInfoProps {
    radius: number
    strokeWidth: number
    end: SharedValue<number>
    font: SkFont
    statusText: string
    stepTitle: string
    stepSubtitle?: string
}

const ProgressInfo: React.FC<ProgressInfoProps> = ({ radius, strokeWidth, end, font, statusText, stepTitle, stepSubtitle }) => {
    const innerRadius = radius - strokeWidth / 2;
    const m = Skia.Matrix();
    m.translate(radius, radius);
    m.rotate(-Math.PI / 2);
    m.translate(-radius, -radius);

    const path = Skia.Path.Make();
    path.addCircle(radius, radius, innerRadius).transform(m);

    const fontSize = font.measureText(statusText);

    const styles = useStyles(radius);

    return (
        <View style={ styles.container }>
            <View style={ styles.circularProgressBarContainer }>
                <Canvas style={{ flex: 1 }}>
                    <Path
                        path={ path }
                        strokeWidth={ strokeWidth }
                        strokeJoin="round"
                        strokeCap="round"
                        style="stroke"
                        color={ theme.colors.gray3 }
                        start={ 0 }
                        end={ 1 }
                    />
                    <Path
                        path={ path }
                        strokeWidth={ strokeWidth }
                        strokeJoin="round"
                        strokeCap="round"
                        style="stroke"
                        color={ theme.colors.greenLight }
                        start={ 0 }
                        end={ end }
                    />
                    <Text
                        x={ radius - fontSize.width / 2 }
                        y={ radius + fontSize.height / 2 }
                        text={ statusText }
                        font={ font }
                        color="white"
                    />
                </Canvas>
            </View>
            <View style={ styles.titleContainer }>
                <TextRN style={ styles.title }>
                    { stepTitle }
                </TextRN>
                {
                    stepSubtitle &&
                        <TextRN style={ styles.subtitle }>
                            { stepSubtitle }
                        </TextRN>
                }
            </View>
        </View>
    )
}

const useStyles = (radius: number) =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            gap: SEPARATOR_SIZES.lightSmall,
            padding: SEPARATOR_SIZES.small,
        },
        circularProgressBarContainer: {
            width: radius * 2,
            height: radius * 2,
        },
        titleContainer: {
            flex: 1,
            gap: SEPARATOR_SIZES.lightSmall,
            justifyContent: "center",
            alignSelf: "flex-start"
        },
        title: {
            fontSize: FONT_SIZES.medium,
            fontFamily: "Gilroy-Heavy",
            lineHeight: FONT_SIZES.medium * 1.1,
            color: theme.colors.white,
            paddingTop: SEPARATOR_SIZES.small
        },
        subtitle: {
            fontSize: FONT_SIZES.small,
            fontFamily: "Gilroy-Medium",
            lineHeight: FONT_SIZES.small * 1.05,
            color: theme.colors.gray1,
        }
    })

export default ProgressInfo;