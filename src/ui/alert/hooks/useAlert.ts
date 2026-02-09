import { useAppDispatch } from "../../../hooks/index.ts";
import {
    closeModal as closeModalAction,
    openModal as openModalAction,
    openToast as openToastAction,
    removeToast as removeToastAction
} from "../model/slice/index.ts";
import { Modal, Toast } from "../model/types/index.ts";
import { COLORS } from "../../../constants/index.ts";
import { useTranslation } from "react-i18next";

export const useAlert = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    const openToast = (toast: Partial<Toast>) => {
        if(!toast) return;

        dispatch(
            openToastAction({
                id: Date.now().toString(),
                type: "info",
                title: t(`toast.types.${ toast?.type ?? "info" }`),
                duration: 3000,
                ...toast
            })
        );
    };

    const closeToast = (id: string) => {
        dispatch(removeToastAction(id));
    };

    const openModal = (modal: Partial<Modal>) => {
        if(!modal) return;

        dispatch(
            openModalAction({
                color: COLORS.fuelYellow,
                acceptText: t("form_button.continue"),
                dismissText: t("form_button.cancel"),
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