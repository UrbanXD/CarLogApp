import React, { ReactElement, ReactNode } from "react";
import { GLOBAL_STYLE, SEPARATOR_SIZES } from "../../Shared/constants/constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { FlatList } from "react-native-gesture-handler";

interface FormProps {
    children: ReactNode | null
}

const Form: React.FC<FormProps> = ({
    children
}) =>
    <FlatList
        data={ React.Children.toArray(children) }
        renderItem={ ({ item }) => item as ReactElement }
        keyExtractor={ (_, index) => index.toString() }
        contentContainerStyle={ [GLOBAL_STYLE.scrollViewContentContainer, { justifyContent: "flex-start", gap: SEPARATOR_SIZES.mediumSmall }] }
        renderScrollComponent={
            (props) =>
                <KeyboardAwareScrollView
                    { ...props }
                    bounces={ false }
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={ false }
                />
        }
    />

export default Form;