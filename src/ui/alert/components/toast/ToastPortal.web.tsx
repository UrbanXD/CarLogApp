import React, { ReactNode } from "react";
import { createPortal } from "react-dom";
import { StyleSheet, View } from "react-native";

type ToastPortalProps = {
    children: ReactNode
}

const ToastPortal: React.FC<ToastPortalProps> = ({ children }) => {
    if(typeof document === "undefined" || !document.body) return null;

    return createPortal(
        <View pointerEvents="box-none" style={ styles.container }>
            { children }
        </View>,
        document.body
    );
};

const styles = StyleSheet.create({
    container: {
        position: "fixed" as any,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 10001
    }
});

export default ToastPortal;
