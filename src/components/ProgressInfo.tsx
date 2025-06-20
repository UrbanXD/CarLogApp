import React from "react";
import { SharedValue } from "react-native-reanimated";
import { StyleSheet, Text as TextRN, View } from "react-native";
import { Canvas, Path, SkFont, Skia, Text } from "@shopify/react-native-skia";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../constants/index.ts";

interface ProgressInfoProps {
    radius: number;
    strokeWidth: number;
    end: SharedValue<number>;
    font: SkFont;
    statusText: string;
    stepTitle: string;
    stepSubtitle?: string;
}

const ProgressInfo: React.FC<ProgressInfoProps> = ({
    radius,
    strokeWidth,
    end,
    font,
    statusText,
    stepTitle,
    stepSubtitle
}) => {
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
                <Canvas style={ { flex: 1 } }>
                    <Path
                        path={ path }
                        strokeWidth={ strokeWidth }
                        strokeJoin="round"
                        strokeCap="round"
                        style="stroke"
                        color={ COLORS.gray4 }
                        start={ 0 }
                        end={ 1 }
                    />
                    <Path
                        path={ path }
                        strokeWidth={ strokeWidth }
                        strokeJoin="round"
                        strokeCap="round"
                        style="stroke"
                        color={ COLORS.greenLight }
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
    );
};

const useStyles = (radius: number) =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            gap: SEPARATOR_SIZES.lightSmall
        },
        circularProgressBarContainer: {
            width: radius * 2,
            height: radius * 2
        },
        titleContainer: {
            flex: 1,
            justifyContent: "center",
            alignSelf: "center"
        },
        title: {
            fontSize: FONT_SIZES.h3,
            fontFamily: "Gilroy-Heavy",
            color: COLORS.white
        },
        subtitle: {
            fontSize: FONT_SIZES.p2,
            fontFamily: "Gilroy-Medium",
            color: COLORS.gray1
        }
    });

export default ProgressInfo;