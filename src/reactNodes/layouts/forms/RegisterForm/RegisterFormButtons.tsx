import React from "react";
import {KeyboardStickyView} from "react-native-keyboard-controller";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import Button from "../../../../components/Button/Button";
import {useMultiStepForm} from "../../../providers/MultiStepFormProvider";
import {StyleSheet} from "react-native";
import {SEPARATOR_SIZES} from "../../../../constants/constants";
import {theme} from "../../../../constants/theme";

const RegisterFormButtons: React.FC = () => {
    const { isFirstStep, isLastStep, next } = useMultiStepForm()

    return (
        <>
            {
                !isFirstStep &&
                <KeyboardStickyView offset={{ closed: 0, opened: -hp(5) }} style={ styles.buttonContainer }>
                    <Button title={ !isLastStep ? "Következő" : "Fiók létrehozása" } onPress={ next } />
                </KeyboardStickyView>
            }
        </>
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