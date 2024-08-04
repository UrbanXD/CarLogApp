import React, {useState} from "react";
import {Alert, StyleSheet, Text, View} from "react-native";
import {theme} from "../../styles/theme";
import Animated, {SlideInDown} from "react-native-reanimated";
import ProgressBar from "../../components/MultiStepForm/ProgressBar";
import {useMultiStepForm} from "../../providers/MultiStepFormProvider";
import {KeyboardAwareScrollView} from "react-native-keyboard-controller";
import {GLOBAL_STYLE} from "../../constants/constants";


const RegisterForm: React.FC = () => {
    const {steps, currentStep, isFirstStep, isLastStep, next, back, submitHandler} = useMultiStepForm()

    return (
        <>
            <ProgressBar currentStep={ currentStep + 1 } stepsCount={ steps.length } />
            <Animated.View
                entering={ SlideInDown.duration(750) }
                style={ styles.container }
            >
                <KeyboardAwareScrollView
                    bounces={ false }
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={ false }
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <View style={ [GLOBAL_STYLE.formContainer, { justifyContent: "flex-start", padding: 20 }] }>
                        { steps[currentStep]() }
                        <View style={ styles.buttonContainer }>
                            { !isLastStep && <Text onPress={ next } style={{color: "red"}}> next </Text> }
                            { !isFirstStep && <Text onPress={ back } style={{color: "red"}}> back </Text> }
                            { isLastStep && <Text onPress={ submitHandler } style={{ fontSize: 22, color: "white" }}>Finish</Text> }
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                {/*<Button onPress={ submitHandlers[currentStep] }  title={"Regisztracio"}/>*/}
            </Animated.View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderTopLeftRadius: 125,
        shadowColor: theme.colors.primaryBackground4,
        elevation: 10,
        backgroundColor: theme.colors.primaryBackground4,
        padding: 20,
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

export default RegisterForm;