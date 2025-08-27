import React, { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useAppSelector } from "../../../../hooks/index.ts";
import { getModal } from "../../model/selectors/index.ts";
import Alert from "../Alert.tsx";
import { hexToRgba } from "../../../../utils/colors/hexToRgba.ts";
import { COLORS } from "../../../../constants/index.ts";
import { useAlert } from "../../hooks/useAlert.ts";

type ModalManagerProps = {
    children: ReactNode | null;
}

const ModalManager: React.FC<ModalManagerProps> = ({
    children
}) => {
    const modal = useAppSelector(getModal);
    const { dismissModal } = useAlert();

    const closeModal = () => {
        if(!modal) return;

        if(modal?.dismissAction) modal.dismissAction();
        dismissModal();
    };

    const acceptModal = () => {
        if(!modal) return;

        if(modal?.acceptAction) modal.acceptAction();
        dismissModal();
    };
    return (
        <>
            <View
                testID="ModalManager"
                style={ styles.managerContainer }
                pointerEvents="box-none"
            >
                {
                    modal &&
                   <>
                      <TouchableOpacity
                         style={ styles.modalOverlay }
                         activeOpacity={ 1 }
                         onPress={ closeModal }
                      />
                      <View testID="ModalContainer" style={ styles.modalContainer }>
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
            </View>
            {
                children
            }
        </>
    );
};

const styles = StyleSheet.create({
    managerContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1
    },
    modalOverlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        alignItems: "center",
        zIndex: 1,
        backgroundColor: hexToRgba(COLORS.black, 0.75)
    },
    modalContainer: {
        position: "absolute",
        alignSelf: "center",
        width: "90%",
        zIndex: 2
    }
});

export default ModalManager;