import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { theme } from "../../constants/theme";
import { FONT_SIZES, SEPARATOR_SIZES } from "../../constants/constants";

interface ProgressBarProps {
    isVertical?: boolean
    currentStep?: number
    stepsCount: number
    titles?: Array<string>
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    isVertical = false,
    stepsCount,
    titles
}) => {

    return (
        <View style={ styles.progressContainer }>
            <View style={ [styles.contentContainer, isVertical && styles.verticalContentContainer]}>
                {
                    Array.from({ length: stepsCount }, (_, i) => i + 1)
                        .map(step => {
                            const isLastStep = step === stepsCount;

                            return (
                                    <View key={ step } style={ styles.timelineContainer }>
                                        {
                                            !isLastStep &&
                                                <View style={ [styles.line, isVertical && styles.verticalLine] } />
                                        }
                                        <View
                                            style={[
                                                styles.circle,
                                            ]} />
                                    </View>
                            )
                        })
                }
            </View>
            <View style={ [styles.contentContainer, isVertical && styles.verticalContentContainer, { flex: 9 }]}>
                {
                    titles?.map((title, index) =>
                        <View style={ styles.timelineTextContainer } key={ index }>
                            <Text numberOfLines={ 2 } key={ index } style={{ color: "white", fontSize: FONT_SIZES.small, lineHeight: FONT_SIZES.small }}>
                                { title }
                            </Text>
                        </View>
                    )
                }
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
        progressContainer: {
            flexDirection: "row",
            paddingLeft: SEPARATOR_SIZES.lightSmall,
            gap: SEPARATOR_SIZES.lightSmall,
        },
        contentContainer: {
            flex: 1,
            flexDirection: "row",
            alignSelf: "flex-start",
        },
        verticalContentContainer: {
            flexDirection: "column",
        },
        timelineContainer: {
            height: hp(6),
            alignItems: "center",
            justifyContent: "flex-start",
            alignSelf: "stretch",
        },
        timelineTextContainer: {
            height: hp(6),
            justifyContent: "flex-start",
            alignSelf: "stretch"
        },
        line: {
            position: 'absolute',
            height: hp(0.5),
            width: "100%",
            backgroundColor: theme.colors.gray3,
            zIndex: 0
        },
        verticalLine: {
            height: "100%",
            width: hp(0.5),
        },
        circle: {
            width: hp(2),
            height: hp(2),
            borderRadius: 50,
            backgroundColor: theme.colors.gray2,
            zIndex: 9,
        },
        doneCircle: {
            borderColor: theme.colors.fuelYellow,
            backgroundColor: theme.colors.fuelYellow
        },
        activeCircle: {
            // borderColor: theme.colors.white,
            backgroundColor: theme.colors.gray3,
        },
        stepText: {
            fontFamily: "Gilroy-Heavy",
            fontSize: hp(3),
            textAlign: "center",
            color: theme.colors.white,
            textShadowColor: theme.colors.black,
            textShadowOffset: {width: -1, height: 1},
            textShadowRadius: 5
        },
        doneLine: {
            backgroundColor: theme.colors.fuelYellow
        }
    });

export default ProgressBar;