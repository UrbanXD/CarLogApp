import { useTranslation } from "react-i18next";
import { useAlert } from "../ui/alert/hooks/useAlert.ts";
import * as ImagePicker from "expo-image-picker";
import { DeniedPermissionToast } from "../ui/alert/presets/toast/DeniedPermissionToast.ts";

export function usePermission() {
    const { t } = useTranslation();
    const { openToast } = useAlert();

    const askMediaLibraryPermission = async () => {
        const { status, granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if(status === "denied") openToast(DeniedPermissionToast.error(t("permission.media_library")));

        return granted;
    };

    const askCameraPermission = async () => {
        const { status, granted } = await ImagePicker.requestCameraPermissionsAsync();

        if(status === "denied") openToast(DeniedPermissionToast.error(t("permission.camera")));

        return granted;
    };

    return { askMediaLibraryPermission, askCameraPermission };
}