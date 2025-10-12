import React, { ReactElement, ReactNode } from "react";
import { SEPARATOR_SIZES } from "../../constants/index.ts";
import { FlatList } from "react-native-gesture-handler";
import { ViewStyle } from "react-native";

type FormProps = {
    children: ReactNode | null
    containerStyle?: ViewStyle
}

function Form({
    children,
    containerStyle
}: FormProps) {
    return (
        <FlatList
            data={ React.Children.toArray(children) }
            renderItem={ ({ item }) => item as ReactElement }
            keyExtractor={ (_, index) => index.toString() }
            contentContainerStyle={ [
                {
                    flexGrow: 1,
                    justifyContent: "flex-start",
                    gap: SEPARATOR_SIZES.mediumSmall,
                    paddingBottom: SEPARATOR_SIZES.lightSmall
                },
                containerStyle
            ] }
            showsVerticalScrollIndicator={ false }
        />
    );
}

export default Form;