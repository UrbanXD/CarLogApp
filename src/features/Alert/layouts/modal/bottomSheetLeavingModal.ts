import {AlertModalProps} from "../../components/AlertModal";
import {ALERT_ICONS} from "../../constants/constants";
import {theme} from "../../../../constants/theme";

export const bottomSheetLeavingModal = (reopenBottomSheet: () => void, dismissBottomSheet: () => void) => {
    return {
        icon: ALERT_ICONS.warning,
        title: "Az adatok elveszhetnek!",
        body: "Ha most bezárja az űrlapot, akkor a rajta elvégzett változtatások elvesznek. Biztosan beszeretné zárni az űrlapot?",
        accept: dismissBottomSheet,
        acceptText: "Űrlap bezárása",
        dismiss: reopenBottomSheet
    } as AlertModalProps;
}