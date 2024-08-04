import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import {theme} from "../../styles/theme";

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
                                <Text style={styles.stepText}>{ step }</Text>
                            </View>
                            { index < stepsCount - 1 && <View style={[styles.line, step < currentStep && styles.doneLine] } /> }
                        </React.Fragment>
                    )
                }
            </View>
        </View>
    );
}
const useStyles = (stepsCount: number, currentStep: number) => {
    return StyleSheet.create({
        progressContainer: {
            flex: 0.15,
            flexDirection: 'row',
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
            width: hp(7),
            height: hp(7),
            borderRadius: 50,
            borderWidth: 2,
            borderColor: theme.colors.primaryBackground2,
            backgroundColor: theme.colors.primaryBackground1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        doneCircle: {
            borderColor: theme.colors.greenDark,
            backgroundColor: theme.colors.greenLight
        },
        activeCircle: {
            borderColor: theme.colors.white
        },
        stepText: {
            fontFamily: "Gilroy-Heavy",
            fontSize: hp(3),
            color: theme.colors.white,
            textShadowColor: theme.colors.primaryBackground3,
            textShadowOffset: {width: -1, height: 1},
            textShadowRadius: 5
        },
        line: {
            flex: 1,
            height: hp(1),
            backgroundColor: theme.colors.primaryBackground2,
            // borderRadius: 15
        },
        doneLine: {
            backgroundColor: theme.colors.greenLight
        }
    })
}

export default ProgressBar;