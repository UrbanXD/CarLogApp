import { AlertModalProps } from "../../../alert/components/AlertModal.tsx";
import { ALERT_ICONS } from "../../../../constants/index.ts";

export const BottomSheetLeavingModal = (reopenBottomSheet: () => void, dismissBottomSheet: () => void) => {
    return {
        icon: ALERT_ICONS.warning,
        title: "Az adatok elveszhetnek!",
        body: "Ha most bezárja az űrlapot, akkor a rajta elvégzett változtatások elvesznek. Biztosan beszeretné zárni az űrlapot?",
        accept: dismissBottomSheet,
        acceptText: "Űrlap bezárása",
        dismiss: reopenBottomSheet
    } as AlertModalProps;
}