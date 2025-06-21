import { ALERT_ICONS } from "../../../../constants/index.ts";
import { Modal } from "../../../alert/model/types/index.ts";

export const BottomSheetLeavingModal = (reopenBottomSheet: () => void, dismissBottomSheet: () => void): Modal => {
    return {
        icon: ALERT_ICONS.warning,
        title: "Az adatok elveszhetnek!",
        body: "Ha most bezárja az űrlapot, akkor a rajta elvégzett változtatások elvesznek. Biztosan beszeretné zárni az űrlapot?",
        acceptAction: dismissBottomSheet,
        acceptText: "Űrlap bezárása",
        dismissAction: reopenBottomSheet
    };
};