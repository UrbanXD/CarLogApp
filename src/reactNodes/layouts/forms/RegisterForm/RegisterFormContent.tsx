import React from "react";
import {StyleSheet, View} from "react-native";
import {GLOBAL_STYLE, ICON_NAMES, SEPARATOR_SIZES} from "../../../../constants/constants";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import Button, {FacebookButton, GoogleButton} from "../../../../components/Button/Button";
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
                    <Button
                        title="Következő"
                        iconRight={ ICON_NAMES.rightArrowHead }
                        onPress={ next }
                    />
                    <TextDivider title="vagy" color={ theme.colors.gray1 } lineHeight={ 1 } marginVertical={ GLOBAL_STYLE.formContainer.gap }/>
                    <GoogleButton onPress={ () => 1 } />
                    <FacebookButton onPress={ () => 1 } />
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