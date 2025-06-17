import React from "react";
import { useMultiStepForm } from "../../context/MultiStepFormProvider";
import { StyleSheet, View } from "react-native";
import Button from "../../../../components/Button/Button";
import { SEPARATOR_SIZES } from "../../../../constants/index.ts";

const MultiStepFormButtons: React.FC = () => {
    const {
        isFirstCount,
        isFirstStep,
        isLastStep,
        next,
        back
    } = useMultiStepForm();

    return (
        <Button.Row style={{ marginBottom: SEPARATOR_SIZES.lightSmall }}>
            <View style={ styles.backButtonContainer }>
                {
                    !isFirstStep &&
                    <Button.MultistepFormBack onPress={ back } />
                }
            </View>
            <View style={ styles.nextButtonContainer }>
                {
                    ((isFirstCount && isFirstStep) || !isFirstStep) &&
                    <Button.MultistepFormNext onPress={ next } isLastStep={ isLastStep } />
                }
            </View>
        </Button.Row>
    )
}

const styles = StyleSheet.create({
    backButtonContainer: {
        flex: 0.175
    },
    nextButtonContainer: {
        flex: 0.825
    }
})

export default MultiStepFormButtons;