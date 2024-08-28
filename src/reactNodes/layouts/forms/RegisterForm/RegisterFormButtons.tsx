import React from "react";
import {KeyboardStickyView} from "react-native-keyboard-controller";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import Button, {ProgressBackButton, ProgressNextButton} from "../../../../components/Button/Button";
import {useMultiStepForm} from "../../../providers/MultiStepFormProvider";
import {StyleSheet, View} from "react-native";
import {FONT_SIZES, GET_ICON_BUTTON_RESET_STYLE, ICON_NAMES, SEPARATOR_SIZES} from "../../../../constants/constants";
import {theme} from "../../../../constants/theme";
import {Icon, IconButton} from "react-native-paper";

const RegisterFormButtons: React.FC = () => {
    const {
        isFirstStep,
        isLastStep,
        next,
        back
    } = useMultiStepForm();

    return (
        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: SEPARATOR_SIZES.small }}>
            {/*<View style={{ flex: 0.2 }}>*/}
                {
                    !isFirstStep &&
                        <ProgressBackButton onPress={ back } />
                }
            {/*</View>*/}
            <View style={{ flex: 0.825 }}>
                {
                    !isFirstStep &&
                        <ProgressNextButton onPress={ next } isLastStep={ isLastStep } />
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 0.4,
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: SEPARATOR_SIZES.medium,
        alignItems: "center",
    }
});

export default RegisterFormButtons;