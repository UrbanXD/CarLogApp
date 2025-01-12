import React from "react";
import { useMultiStepForm } from "../../context/MultiStepFormProvider";
import { StyleSheet, View } from "react-native";
import Button from "../../../Button/components/Button";
import { SEPARATOR_SIZES } from "../../../Shared/constants/constants";

interface MultiStepFormButtonsProps {
    isFirstCount: boolean
}

const MultiStepFormButtons: React.FC<MultiStepFormButtonsProps> = ({
    isFirstCount
}) => {
    const {
        isFirstStep,
        isLastStep,
        next,
        back
    } = useMultiStepForm();

    return (
        <Button.Row>
            <View style={ styles.backButtonContainer }>
                {
                    !isFirstStep &&
                    <Button.MultistepFormBack
                        onPress={ back }
                    />
                }
            </View>
            <View style={ styles.nextButtonContainer }>
                {
                    ((isFirstCount && isFirstStep) || !isFirstStep) &&
                    <Button.MultistepFormNext
                        onPress={ next }
                        isLastStep={ isLastStep }
                    />
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