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
        <View style={ styles.buttonsContainer }>
            <View style={{ flex: 0.175 }}>
                {
                    !isFirstStep &&
                    <Button.MultistepFormBack
                        onPress={ back }
                    />
                }
            </View>
            <View style={{ flex: 0.825 }}>
                {
                    ((isFirstCount && isFirstStep) || !isFirstStep) &&
                    <Button.MultistepFormNext
                        onPress={ next }
                        isLastStep={ isLastStep }
                    />
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
        gap: SEPARATOR_SIZES.small
    }
});

export default MultiStepFormButtons;