import React from "react";
import { useMultiStepForm } from "../../../providers/MultiStepFormProvider";
import { StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES } from "../../../../constants/constants";
import { ProgressBackButton, ProgressNextButton } from "../../../../components/Button/Button";

const NewCarFormButtons: React.FC = () => {
    const {
        isFirstStep,
        isLastStep,
        next,
        back
    } = useMultiStepForm();

    return (
        <View style={ styles.buttonsContainer }>
            <View>
                {
                    !isFirstStep &&
                    <ProgressBackButton onPress={ back } />
                }
            </View>
            <View>
                <ProgressNextButton onPress={ next } isLastStep={ isLastStep } />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonsContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: SEPARATOR_SIZES.small
    }
})

export default NewCarFormButtons;