import React, {useEffect, useRef, useState} from "react";
import {GLOBAL_STYLE, ICON_NAMES, SEPARATOR_SIZES} from "../../constants/constants";
import {theme} from "../../constants/theme";
import BackButtonHeader from "../layouts/header/BackButtonHeader";
import {router} from "expo-router";
import {StyleSheet, View} from "react-native";
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {useMultiStepForm} from "../providers/MultiStepFormProvider";
import Animated, {SlideInDown, useSharedValue, withTiming} from "react-native-reanimated";
import {useFont} from "@shopify/react-native-skia";
import ProgressInfo from "../../components/MultiStepForm/ProgressInfo";
import {KeyboardAwareScrollView, KeyboardEvents, KeyboardStickyView} from "react-native-keyboard-controller";
import Button from "../../components/Button/Button";
import TextDivider from "../../components/TextDivider/TextDivider";
import {registerStepsTitle} from "../../constants/formSchema/registerForm";

const RegisterScreen: React.FC = () => {
    const {
        steps,
        stepsCount,
        currentStep,
        isFirstStep,
        isLastStep,
        next,
        back,
        submitHandler
    } = useMultiStepForm();

    const gap = useSharedValue(SEPARATOR_SIZES.large);
    const end = useSharedValue(0);

    useEffect(() => {
        console.log(currentStep, stepsCount)
        end.value = withTiming((currentStep - (steps.length !== stepsCount ? 0 : 1)) / stepsCount, { duration: 1500 });
    }, [currentStep]);

    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

    useEffect(() => {
        const show = KeyboardEvents.addListener("keyboardWillShow", (e) => {
            gap.value = withTiming(SEPARATOR_SIZES.small, { duration: 500 });
            setIsKeyboardOpen(true);
        });

        const close = KeyboardEvents.addListener("keyboardWillHide", (e) => {
            gap.value = withTiming(SEPARATOR_SIZES.large, { duration: 500 });
            setIsKeyboardOpen(false);
        })

        return () => {
            show.remove();
            close.remove();
        };
    }, []);

    // const font = useFont(require("../assets/fonts/Gilroy-Heavy.otf"), hp(!isKeyboardOpen ? 4 : 2.75));
    const font = useFont(require("../../assets/fonts/Gilroy-Heavy.otf"), hp(3));

    if (!font) return <></>

    return (
        <Animated.View
            style={[
                GLOBAL_STYLE.pageContainer,
                {
                    backgroundColor: theme.colors.black,
                    gap: gap
                }
            ]}
        >
            <BackButtonHeader
                title="Fiók létrehozása"
                backButtonAction={ () => router.replace({ pathname: "/" }) }
            />
            <Animated.View
                entering={ SlideInDown.duration(750) }
                style={ styles.container }
            >
                <KeyboardAwareScrollView
                    bounces={ false }
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={ false }
                    contentContainerStyle={ [GLOBAL_STYLE.scrollViewContentContainer, { gap: SEPARATOR_SIZES.small }] }
                >
                    {
                        !isFirstStep &&
                            <View style={ styles.progessBarContainer }>
                                <ProgressInfo
                                    radius={ hp(6) }
                                    strokeWidth={ hp(1.25) }
                                    // radius={ hp(!isKeyboardOpen ? 8 : 5) }
                                    // strokeWidth={ hp(!isKeyboardOpen ? 2 : 1.25) }
                                    end={ end }
                                    font={ font }
                                    statusText={ `${ stepsCount } / ${ currentStep }` }
                                    stepTitle={ registerStepsTitle[currentStep] }
                                    stepSubtitle={ registerStepsTitle[currentStep + 1] !== undefined ? `Következő: ${ registerStepsTitle[currentStep + 1] }` : undefined }
                                />
                            </View>
                    }
                    <View style={ [styles.contentContainer, currentStep === 0 && { justifyContent: "flex-start" }] }>
                        <View style={ [GLOBAL_STYLE.formContainer, { justifyContent: "flex-start", paddingBottom: isKeyboardOpen ? hp(10) : 0 }] }>
                            { steps[currentStep]() }
                            {
                                isFirstStep &&
                                <>
                                    <Button title="Következő" onPress={ next } />
                                    <TextDivider title="vagy" color={ theme.colors.gray1 } lineHeight={ 1 } marginVertical={ GLOBAL_STYLE.formContainer.gap }/>
                                    <Button onPress={ () => 1 } title="Folytatás Google fiókkal" icon={require("../../assets/google_logo.png")} inverse={true} backgroundColor={ theme.colors.white } textColor={ theme.colors.googleRed } textStyle={{ fontSize: hp(2) }} />
                                    <Button onPress={ () => 1 } title="Folytatás Facebook fiókkal" icon={require("../../assets/facebook_logo.png")} backgroundColor={ theme.colors.facebookBlue } textColor={ theme.colors.white } textStyle={{ fontSize: hp(2) }} />
                                </>
                            }
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                {
                    !isFirstStep &&
                    <KeyboardStickyView offset={{ closed: 0, opened: -hp(5) }} style={ styles.buttonContainer }>
                            <Button title={ !isLastStep ? "Következő" : "Fiók létrehozása" } onPress={ next } />
                            {/*    { !isFirstStep && <Text onPress={ back } style={{color: "red"}}> back </Text> }*/}
                            {/*    { !isLastStep && <Text onPress={ next } style={{color: "red"}}> next </Text> }*/}
                            {/*    { isLastStep && <Text onPress={ submitHandler } style={{ fontSize: 22, color: "white" }}>Finish</Text> }*/}
                    </KeyboardStickyView>
                }
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: SEPARATOR_SIZES.lightLarge,
        borderTopLeftRadius: 125,
        shadowColor: theme.colors.black2,
        elevation: 10,
        backgroundColor: theme.colors.black2,
    },
    progessBarContainer: {
        paddingLeft: SEPARATOR_SIZES.mediumSmall,
    },
    contentContainer: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: SEPARATOR_SIZES.medium,
    },
    buttonContainer: {
        flex: 0.4,
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: SEPARATOR_SIZES.medium,
        alignItems: "center",
    }
});

export default RegisterScreen;