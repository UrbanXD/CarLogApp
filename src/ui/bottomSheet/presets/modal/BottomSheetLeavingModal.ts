import { ALERT_ICONS } from "../../../../constants/index.ts";
import { Modal } from "../../../alert/model/types/index.ts";
import i18n from "../../../../i18n/index.ts";

export const BottomSheetLeavingModal = (
    reopenBottomSheet: () => void,
    dismissBottomSheet: () => void
): Partial<Modal> => {
    return {
        icon: ALERT_ICONS.warning,
        title: i18n.t("modal.bottom_sheet_leaving.title"),
        body: i18n.t("modal.bottom_sheet_leaving.body"),
        acceptAction: dismissBottomSheet,
        acceptText: i18n.t("modal.bottom_sheet_leaving.accept"),
        dismissAction: reopenBottomSheet
    };
};