import { ModalAction } from "../../model/types/index.ts";
import i18n from "../../../../i18n/index.ts";

export const DeleteModal: ModalAction = ({ name, acceptAction, dismissAction }) => {
    return {
        title: i18n.t("modal.delete.title", { name: name ?? i18n.t("common.element") }),
        body: i18n.t("modal.delete.body"),
        acceptText: i18n.t("modal.delete.accept"),
        acceptAction: acceptAction,
        dismissAction: dismissAction
    };
};