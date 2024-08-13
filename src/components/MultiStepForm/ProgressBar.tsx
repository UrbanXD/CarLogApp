import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import {theme} from "../../constants/theme";
import {Icon} from "react-native-paper";
import {ICON_NAMES} from "../../constants/constants";
import hexToRgba from "hex-to-rgba";

interface ProgressBarProps {
    currentStep: number,
    stepsCount: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, stepsCount }) => {
    const styles = useStyles(stepsCount, currentStep);
    return (
        <View style={ styles.progressContainer }>
            <View style={ styles.stepContainer }>
                {
                    Array.from({ length: stepsCount }, (_, i) => i + 1).map((step, index) =>
                        <React.Fragment key={index}>
                            <View style={[styles.circle, step < currentStep && styles.doneCircle, step === currentStep && styles.activeCircle]}>
                                {
                                    currentStep === step &&
                                        <View style={{ backgroundColor: theme.colors.fuelYellow, width: hp(2), height: hp(2), borderRadius: 50 }}></View>
                                }
                            </View>
                            { index < stepsCount - 1 && <View style={[styles.line, { justifyContent: "center" }, step < currentStep && styles.doneLine] } /> }
                        </React.Fragment>
                    )
                }
            </View>
            {/*<View style={ styles.stepContainer }>*/}
            {/*    <View style={{ flex: 1, justifyContent: "center" }}>*/}
            {/*        <Text style={[styles.stepText, {  }]}>Helloeascfc</Text>*/}
            {/*    </View>*/}
            {/*    { <View style={[styles.line, { justifyContent: "center", backgroundColor: "transparent" }] } /> }*/}
            {/*    <View style={{ flex: 1, justifyContent: "center" }}>*/}
            {/*        <Text style={[styles.stepText, {  }]}>Hello</Text>*/}
            {/*    </View>*/}
            {/*    { <View style={[styles.line, { justifyContent: "center", backgroundColor: "transparent" }] } /> }*/}
            {/*    <View style={{ flex: 1, justifyContent: "center" }}>*/}
            {/*        <Text style={[styles.stepText, { alignSelf: "center" }]}>Hello</Text>*/}
            {/*    </View>*/}
            {/*</View>*/}
        </View>
    );
}
const useStyles = (stepsCount: number, currentStep: number) => {
    return StyleSheet.create({
        progressContainer: {
            // flex: 1,
            flexDirection: 'column',
            justifyContent: "center",
            alignItems: 'center',
            gap: 0,
            paddingHorizontal: hp(1.5)
        },
        stepContainer: {
            flex: 1,
            flexDirection: 'row',
            alignSelf: "center",
            alignItems: 'center',
            justifyContent: "space-between",
        },
        circle: {
            width: hp(5),
            height: hp(5),
            borderRadius: 50,
            borderWidth: 2,
            borderColor: theme.colors.gray3,
            backgroundColor: theme.colors.gray3,
            justifyContent: 'center',
            alignItems: 'center',
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
        line: {
            flex: 1,
            height: hp(0.5),
            backgroundColor: theme.colors.gray3,
            // borderRadius: 15
        },
        doneLine: {
            backgroundColor: theme.colors.fuelYellow
        }
    })
}

export default ProgressBar;