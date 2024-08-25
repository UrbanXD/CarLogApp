import React from "react";
import {StyleSheet, View} from "react-native";
import {GLOBAL_STYLE, SEPARATOR_SIZES} from "../../../../constants/constants";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import Button from "../../../../components/Button/Button";
import TextDivider from "../../../../components/TextDivider/TextDivider";
import {theme} from "../../../../constants/theme";
import {useMultiStepForm} from "../../../providers/MultiStepFormProvider";

const RegisterFormContent: React.FC = () => {
    const {
        steps,
        currentStep,
        isFirstStep,
        next,
        back
    } = useMultiStepForm();

    return (
        <View style={ [GLOBAL_STYLE.formContainer, { justifyContent: "flex-start"}] }>
            { steps[currentStep]() }
            {
                isFirstStep &&
                <>
                    <Button title="Következő" onPress={ next } />
                    <TextDivider title="vagy" color={ theme.colors.gray1 } lineHeight={ 1 } marginVertical={ GLOBAL_STYLE.formContainer.gap }/>
                    <Button
                        onPress={ () => 1 }
                        title="Folytatás Google fiókkal"
                        icon={ require("../../../../assets/google_logo.png") }
                        inverse
                        backgroundColor={ theme.colors.white }
                        textColor={ theme.colors.googleRed }
                        textStyle={{ fontSize: hp(2) }}
                    />
                    <Button
                        onPress={ () => 1 }
                        title="Folytatás Facebook fiókkal"
                        icon={ require("../../../../assets/facebook_logo.png") }
                        backgroundColor={ theme.colors.facebookBlue }
                        textColor={ theme.colors.white }
                        textStyle={{ fontSize: hp(2) }}
                    />
                </>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        justifyContent: "center",
    },
});

export default RegisterFormContent;