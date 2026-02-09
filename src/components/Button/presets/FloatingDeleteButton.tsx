import { DEFAULT_SEPARATOR } from "../../../constants/index.ts";
import { View } from "react-native";
import React from "react";
import { DeleteButton, DeleteButtonProps } from "./DeleteButton.tsx";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ViewStyle } from "../../../types/index.ts";

type FloatingDeleteButtonProps = DeleteButtonProps & { containerStyle?: ViewStyle }

export function FloatingDeleteButton({ containerStyle, ...restProps }: FloatingDeleteButtonProps) {
    const { bottom } = useSafeAreaInsets();

    return (
        <View style={ { position: "absolute", zIndex: 2, bottom: bottom, right: DEFAULT_SEPARATOR } }>
            <DeleteButton { ...restProps } />
        </View>
    );
}