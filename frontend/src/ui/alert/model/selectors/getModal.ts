import { RootState } from "../../../../database/redux/index.ts";
import { Modal } from "../types/index.ts";

export const getModal = (state: RootState): Modal | null => state.alert.modal;