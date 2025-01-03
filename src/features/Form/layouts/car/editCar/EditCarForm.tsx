import React from "react";
import useEditCarForm from "./useEditCar";
import {CarFormFieldType, carFormSchema} from "../../../constants/schemas/carSchema";
import Form from "../../../components/Form";
import {CarTableType} from "../../../../Database/connector/powersync/AppSchema";
import Button from "../../../../Button/components/Button";
import {heightPercentageToDP} from "react-native-responsive-screen";
import {View} from "react-native";
import {ICON_NAMES, SEPARATOR_SIZES} from "../../../../Shared/constants/constants";
import {sub} from "@shopify/react-native-skia";

interface EditCarFormProps {
    car: CarTableType
    stepIndex: number
    forceCloseBottomSheet: () => void
}
const EditCarForm: React.FC<EditCarFormProps> = ({
    car,
    stepIndex,
    forceCloseBottomSheet
}) => {
    const {
        submitHandler,
        reset,
        steps,
        trigger,
        formState
    } = useEditCarForm(car, forceCloseBottomSheet);

    const handleSave =
        async () => await submitHandler();


    return (
        <Form>
            { steps[stepIndex]() }
            <View style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                gap: SEPARATOR_SIZES.lightSmall
            }}>
                <Button.Icon
                    icon={ICON_NAMES.reset}
                    onPress={ () => reset() }
                />
                <Button.Text
                    text="Mentés"
                    onPress={ handleSave }
                    style={{ flex: 0.9 }}
                />
            </View>
        </Form>
    )
}

export default EditCarForm;