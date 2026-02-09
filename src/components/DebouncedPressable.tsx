import { Pressable, PressableProps } from "react-native";
import { useMemo } from "react";
import { debounce } from "es-toolkit";

type DebouncedPressableProps = PressableProps & { debounceMs?: number }

export function DebouncedPressable({ debounceMs, onPress, ...props }: DebouncedPressableProps) {
    const debouncedOnPress = useMemo(
        () => onPress ? debounce(onPress, debounceMs ?? 350) : null,
        [onPress, debounceMs]
    );

    return <Pressable onPress={ debouncedOnPress } { ...props } />;
}