import React, { ReactNode } from "react";
import { ICON_NAMES, SEPARATOR_SIZES } from "../../constants/index.ts";
import { FlatList } from "react-native-gesture-handler";
import Button from "../Button/Button.ts";
import { View } from "react-native";
import { UseFormReturn } from "react-hook-form";

type EditFormProps<FormSchema> = {
    renderInputFields: () => ReactNode
    submitHandler: () => Promise<void>
    reset: UseFormReturn<FormSchema>["reset"]
}

function EditForm<FormSchema = any>({
    renderInputFields,
    submitHandler,
    reset
}: EditFormProps<FormSchema>) {
    return (
        <View style={ { flex: 1, gap: SEPARATOR_SIZES.normal } }>
            <FlatList
                data={ [] }
                renderItem={ () => <></> }
                ListEmptyComponent={ () => <>{ renderInputFields() }</> }
            />
            <Button.Row>
                <Button.Icon
                    icon={ ICON_NAMES.reset }
                    onPress={ () => reset() }
                />
                <Button.Text
                    text="Mentés"
                    onPress={ submitHandler }
                    style={ { flex: 0.9 } }
                    loadingIndicator
                />
            </Button.Row>
        </View>
    );
}

export default EditForm;