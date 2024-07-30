import React, {ReactNode, useState} from "react";
import {KeyboardAvoidingView, StyleSheet, Text, View} from "react-native";
import {theme} from "../../styles/theme";
import ProgressBar from "./ProgressBar";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

interface MultiStepFormProps {
    steps: Array<() => ReactNode>,
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ steps }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isBackActionAvailable, setIsBackActionAvailable] = useState(false);
    const [isNextActionAvailable, setIsNextActionAvailable] = useState(steps.length > 0);

    const nextStep = () => {
        if(currentStep + 1 >= steps.length){
            return;
        }

        if(currentStep + 1 == 1){
            setIsBackActionAvailable(true);
        }

        if(currentStep + 1 == steps.length - 1) {
            setIsNextActionAvailable(false);
        }

        setCurrentStep(currentStep + 1);
        console.log("next", currentStep, currentStep +1)
    }

    const previousStep = () => {
        if(currentStep - 1 < 0){
            return;
        }

        if(currentStep - 1 == steps.length - 2) {
            setIsNextActionAvailable(true);
        }

        if(currentStep - 1 == 0) {
            setIsBackActionAvailable(false);
        }

        setCurrentStep(currentStep - 1);
    }

    return (
        <KeyboardAvoidingView style={ styles.container }>
            <ProgressBar currentStep={ currentStep + 1} stepsCount={ steps.length } />
            { steps[currentStep]() }
            <View style={ styles.buttonContainer }>
                { isNextActionAvailable && <Text onPress={ nextStep } style={{color: "red"}}> next </Text> }
                { isBackActionAvailable && <Text onPress={ previousStep } style={{color: "red"}}> back </Text> }
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    buttonContainer: {
        flex: 0.1,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        alignItems: "center",
        backgroundColor: "blue",
    }
})

export default MultiStepForm;