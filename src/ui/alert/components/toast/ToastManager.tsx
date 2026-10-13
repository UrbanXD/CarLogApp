import React, { ReactNode } from "react";
import { useAppSelector } from "../../../../hooks/index.ts";
import { getToasts } from "../../model/selectors/index.ts";
import { Platform, StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES, SIMPLE_HEADER_HEIGHT } from "../../../../constants/index.ts";
import AlertToast from "./AlertToast.tsx";
import { shallowEqual } from "react-redux";
import { Toast } from "../../model/types/index.ts";
import ToastPortal from "./ToastPortal";

type ToastManagerProps = {
    children: ReactNode | null;
}

const ToastManager: React.FC<ToastManagerProps> = ({
    children
}) => {
    const toasts: Array<Toast> = useAppSelector(getToasts, shallowEqual);

    return (
        <>
            <ToastPortal>
                <View testID="ToastManager" style={ styles.container } pointerEvents="box-none">
                    {
                        toasts.map(toast => <AlertToast key={ toast.id } toast={ toast }/>)
                    }
                </View>
            </ToastPortal>
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
        // React Native Web renders Modal content at z-index 9999 in a body portal.
        // Keep web toasts above forms and other modal content.
        zIndex: Platform.OS === "web" ? 10001 : 99
    }
});

export default ToastManager;
