import React, { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useAppSelector } from "../../../../hooks/index.ts";
import { getModal } from "../../model/selectors/index.ts";
import Alert from "../Alert.tsx";
import { hexToRgba } from "../../../../utils/colors/hexToRgba.ts";
import { COLORS } from "../../../../constants/index.ts";
import { closeModal } from "../../model/slice/index.ts";
import { useAlert } from "../../hooks/useAlert.ts";

type ModalManagerProps = {
    children: ReactNode | null;
}

const ModalManager: React.FC<ModalManagerProps> = ({
    children
}) => {
    const modal = useAppSelector(getModal);
    const { dismissModal } = useAlert();

    const closeModal3 = () => {
        if(!modal) return;

        if(modal?.dismissAction) modal.dismissAction();
        dismissModal();
    };

    const acceptModal3 = () => {
        if(!modal) return;

        if(modal?.acceptAction) modal.acceptAction();
        dismissModal();
    };

    return (
        <View testID="ModalManager">
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
                        accept={ acceptModal3 }
                        acceptText={ modal.acceptText }
                        dismiss={ closeModal3 }
                        dismissText={ modal.dismissText }
                     />
                  </View>
               </>
            }
            {
                children
            }
        </View>
    );
};

const styles = StyleSheet.create({
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
        width: "90%"
    }
});

export default ModalManager;