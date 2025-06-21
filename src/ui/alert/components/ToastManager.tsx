import React, { ReactNode } from "react";
import { useAppSelector } from "../../../hooks/index.ts";
import { getToasts } from "../model/selectors/index.ts";
import { StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES, SIMPLE_HEADER_HEIGHT } from "../../../constants/index.ts";
import AlertToast from "./AlertToast.tsx";
import { shallowEqual } from "react-redux";
import { Toast } from "../model/types/index.ts";

type ToastManagerProps = {
    children: ReactNode | null;
}

const ToastManager: React.FC<ToastManagerProps> = ({
    children
}) => {
    const toasts: Array<Toast> = useAppSelector(getToasts, shallowEqual);

    return (
        <>
            <View style={ styles.container }>
                {
                    toasts.map(toast => <AlertToast key={ toast.id } toast={ toast }/>)
                }
            </View>
            { children }
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: SIMPLE_HEADER_HEIGHT * 2,
        width: "80%",
        alignSelf: "center",
        gap: SEPARATOR_SIZES.lightSmall,
        zIndex: 1
    }
});

export default ToastManager;