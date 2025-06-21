import { useAppDispatch } from "../../../hooks/index.ts";
import {
    closeModal as closeModalAction,
    openModal as openModalAction,
    openToast as openToastAction,
    removeToast as removeToastAction
} from "../model/slice/index.ts";
import { Modal, Toast } from "../model/types/index.ts";
import { ALERT_TITLES } from "../constants/index.ts";
import { COLORS } from "../../../constants/index.ts";

export const useAlert = () => {
    const dispatch = useAppDispatch();

    const openToast = (toast: Partial<Toast>) => {
        dispatch(
            openToastAction({
                id: Date.now().toString(),
                type: "info",
                title: ALERT_TITLES[toast?.type || "info"],
                duration: 4000,
                ...toast
            })
        );
    };

    const closeToast = (id: string) => {
        dispatch(removeToastAction(id));
    };

    const openModal = (modal: Partial<Modal>) => {
        dispatch(
            openModalAction({
                color: COLORS.fuelYellow,
                acceptText: "Folytatás",
                dismissText: "Mégse",
                ...modal
            })
        );
    };

    const dismissModal = () => {
        dispatch(closeModalAction());
    };

    return ({
        openToast,
        closeToast,
        openModal,
        dismissModal
    });
};