import React, {ReactNode, useState} from "react";
import {KeyboardAvoidingView, StyleSheet, Text, View} from "react-native";
import {useMultiStepForm} from "../../providers/MultiStepFormProvider";

const MultiStepForm: React.FC = () => {
    const {steps, currentStep, isFirstStep, isLastStep, next, back, submitHandler} = useMultiStepForm()
    return (
        <KeyboardAvoidingView style={ styles.container }>
            { steps[currentStep]() }
            <View style={ styles.buttonContainer }>
                { !isLastStep && <Text onPress={ next } style={{color: "red"}}> next </Text> }
                { !isFirstStep && <Text onPress={ back } style={{color: "red"}}> back </Text> }
                { isLastStep && <Text onPress={ submitHandler } style={{ fontSize: 22, color: "white" }}>Finish</Text> }
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