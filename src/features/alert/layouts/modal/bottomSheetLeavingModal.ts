import {AlertModalProps} from "../../components/AlertModal";
import {ALERT_ICONS} from "../../constants/constants";
import {theme} from "../../../core/constants/theme";

export const bottomSheetLeavingModal: AlertModalProps = {
    icon: ALERT_ICONS.warning,
    title: "Az adatok elveszhetnek!",
    body: "Ha most bezárja az űrlapot, akkor a rajta elvégzett változtatások el vesznek. Biztosan beszeretné zárni az űrlapot?",
    accept: () => {},
    acceptText: "Űrlap bezárása",
    dismiss: () => {}
}