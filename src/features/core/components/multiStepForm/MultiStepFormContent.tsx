import React from "react";
import { useMultiStepForm } from "../../context/MultiStepFormProvider";
import { View } from "react-native";
import Form from "../form/Form";

const MultiStepFormContent: React.FC = () => {
    const {
        steps,
        currentStep,
    } = useMultiStepForm();

    return (
        <Form>
            {
                steps.map(
                    (step, index) =>
                        <View
                            key={ index }
                            style={{ display: currentStep === index ? 'flex' : 'none' }}
                        >
                            { step() }
                        </View>
                )
            }
        </Form>
    )
}

export default MultiStepFormContent;