import React, {Context, createContext, ReactElement, ReactNode, useCallback, useContext, useEffect} from "react";
import {StyleSheet, View} from "react-native";
import {SEPARATOR_SIZES, SIMPLE_HEADER_HEIGHT} from "../constants/constants";
import {AlertToastProps} from "../components/shared/alert/AlertToast";
import Alert from "../components/shared/alert/Alert";

interface AlertProviderValue {
    addToast: (args: AlertToastProps) => void,
    removeToast: (id: string) => void,
    openModal: () => void,
    closeModal: () => void,
}

const AlertContext =
    createContext<AlertProviderValue | null>(null);

interface AlertProviderProps {
    children: ReactElement | null
}

export const AlertProvider: React.FC<AlertProviderProps> = ({
    children
}) => {
    const [toasts, setToasts] = React.useState<Array<AlertToastProps>>([]);

    const addToast = (props:AlertToastProps) => {
        const id = Date.now().toString();
        setToasts(prevToasts => [
            ...prevToasts,
            {
                ...props,
                id
            }
        ]);
    };

    const removeToast = (id: string) => {
        setToasts(prevToasts =>
            prevToasts.filter(toast => toast.id !== id)
        );
    };

    const openModal = () => {
    };
    const closeModal = () => {
    };


    return (
        <AlertContext.Provider
            value={{
                addToast,
                removeToast,
                openModal,
                closeModal
            }}
        >
            <View style={ styles.container }>
                {
                    toasts.map(
                        (toast, index) =>
                            <Alert.Toast
                                key={ toast.id }
                                id={ toast.id }
                                title={ toast.title }
                                type={ toast.type }
                                body={ toast.body }
                            />
                    )
                }
            </View>
            { children }
        </AlertContext.Provider>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: SIMPLE_HEADER_HEIGHT * 2,
        width: "100%",
        gap: SEPARATOR_SIZES.lightSmall,
        zIndex: 1,
    }
});

export const useAlert = () =>
    useContext<AlertProviderValue>(
        AlertContext as Context<AlertProviderValue>
    );