import React, { ReactElement, ReactNode } from "react";
import { GLOBAL_STYLE, SEPARATOR_SIZES } from "../../../constants/constants";
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
    />

export default Form;