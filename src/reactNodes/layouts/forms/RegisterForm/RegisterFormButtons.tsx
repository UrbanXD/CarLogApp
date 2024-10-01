import React from "react";
import { ProgressBackButton, ProgressNextButton } from "../../../../components/Button/Button";
import { useMultiStepForm } from "../../../providers/MultiStepFormProvider";
import { StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES } from "../../../../constants/constants";

const RegisterFormButtons: React.FC = () => {
    const {
        isFirstStep,
        isLastStep,
        next,
        back
    } = useMultiStepForm();

    return (
        <View style={ styles.buttonsContainer }>
            {
                !isFirstStep &&
                    <ProgressBackButton onPress={ back } />
            }
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
    buttonsContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: SEPARATOR_SIZES.small,
        alignItems: "center",
    }
});

export default RegisterFormButtons;