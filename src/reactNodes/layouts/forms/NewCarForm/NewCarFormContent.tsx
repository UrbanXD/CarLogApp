import React from "react";
import { useMultiStepForm } from "../../../providers/MultiStepFormProvider";
import { View } from "react-native";
import { GLOBAL_STYLE } from "../../../../constants/constants";

const NewCarFormContent: React.FC = () => {
    const {
        steps,
        currentStep,
    } = useMultiStepForm();

    return (
        <View style={ [GLOBAL_STYLE.formContainer, { justifyContent: "flex-start" }] }>
            {
                steps.map((step, index) =>{
                        return (
                            <View key={index} style={{ display: currentStep === index ? 'flex' : 'none' }}>
                                { step() }
                            </View>
                        )
                    }
                )
            }
        </View>
    )
}

export default NewCarFormContent;