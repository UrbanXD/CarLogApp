import React, { Context, createContext, ReactElement, useContext } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SEPARATOR_SIZES, SIMPLE_HEADER_HEIGHT } from "../../Shared/constants/constants";
import {hexToRgba} from "../../Shared/utils/colors/hexToRgba";
import {theme} from "../../Shared/constants/theme";
import {AlertToastProps} from "../../Alert/components/AlertToast";
import {AlertModalProps} from "../../Alert/components/AlertModal";
import Alert from "../../Alert/components/Alert";

interface AlertProviderValue {
    addToast: (args: AlertToastProps) => void,
    removeToast: (id: string) => void,
    openModal: (args: AlertModalProps) => void,
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
    const [toasts, setToasts] = React.useState<Array<AlertToastProps & {id: string}>>([]);
    const [modal, setModal] = React.useState<AlertModalProps | null>(null);

    const addToast = (props: AlertToastProps) =>
        setToasts(prevToasts => [
            ...prevToasts,
            {
                ...props,
                id: Date.now().toString()
            }
        ]);

    const removeToast = (id: string) =>
        setToasts(prevToasts =>
            prevToasts.filter(toast => toast.id !== id)
        );

    const openModal = (props: AlertModalProps) =>
        setModal(props);

    const acceptModal = () => {
        setModal(prevModal => {
            if(prevModal?.accept) {
                prevModal.accept();
            }
            return null;
        })
    }

    const closeModal = () => {
        setModal(prevModal => {
            if(prevModal?.dismiss) {
                prevModal.dismiss();
            }

            return null;
        });
    }

    return (
        <AlertContext.Provider
            value={{
                addToast,
                removeToast,
                openModal,
                closeModal
            }}
        >
            <View style={ styles.toastContainer }>
                {
                    toasts.map(
                        toast=>
                            <Alert.Toast
                                key={ toast.id }
                                title={ toast.title }
                                type={ toast.type }
                                body={ toast.body }
                                close={ () => removeToast(toast.id) }
                            />
                    )
                }
            </View>
            {
                modal &&
                <>
                    <TouchableOpacity
                        style={ styles.modalOverlay }
                        activeOpacity={ 1 }
                        onPress={ closeModal }
                    />
                    <View style={ styles.modalContainer }>
                        <Alert.Modal
                            icon={ modal.icon }
                            title={ modal.title }
                            body={ modal.body }
                            color={ modal.color }
                            accept={ acceptModal }
                            acceptText={ modal.acceptText }
                            dismiss={ closeModal }
                            dismissText={ modal.dismissText }
                        />
                    </View>
                </>
            }
            { children }
        </AlertContext.Provider>
    )
}

const styles = StyleSheet.create({
    toastContainer: {
        position: "absolute",
        top: SIMPLE_HEADER_HEIGHT * 2,
        width: "80%",
        alignSelf: "center",
        gap: SEPARATOR_SIZES.lightSmall,
        zIndex: 1,
    },
    modalOverlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        alignItems: "center",
        zIndex: 1,
        backgroundColor: hexToRgba(theme.colors.black, 0.75)
    },
    modalContainer: {
        position: "absolute",
        alignSelf: "center",
        width: "90%",
    }
});

export const useAlert = () =>
    useContext<AlertProviderValue>(
        AlertContext as Context<AlertProviderValue>
    );