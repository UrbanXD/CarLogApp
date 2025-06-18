import React from "react";
import { UseCustomFormProps } from "../../features/car/constants/index.ts";
import { ICON_NAMES, SEPARATOR_SIZES } from "../../constants/index.ts";
import { FlatList } from "react-native-gesture-handler";
import Button from "../Button/Button.ts";
import { View } from "react-native";

interface EditFormProps extends UseCustomFormProps {
    stepIndex: number
}

const EditForm: React.FC<EditFormProps> = ({
    stepIndex,
    steps,
    reset = () => {},
    submitHandler
}) => {
    const handleSave =
        async () => await submitHandler(stepIndex);

    return (
        <View style={{ flex: 1, gap: SEPARATOR_SIZES.normal }}>
            <FlatList
                data={ [] }
                renderItem={ () => <></> }
                ListEmptyComponent={
                    <>
                        { steps[stepIndex]() }
                    </>
                }
            />
            <Button.Row>
                <Button.Icon
                    icon={ ICON_NAMES.reset }
                    onPress={ () => reset && reset() }
                />
                <Button.Text
                    text="Mentés"
                    onPress={ handleSave }
                    style={{ flex: 0.9 }}
                    loadingIndicator
                />
            </Button.Row>
        </View>
    )
}

export default EditForm;