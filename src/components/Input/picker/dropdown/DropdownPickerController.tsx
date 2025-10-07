import React from "react";
import { TouchableOpacity } from "react-native";
import TextInput from "../../text/TextInput.tsx";
import { ICON_NAMES } from "../../../../constants/index.ts";
import { PickerItemType } from "../PickerItem.tsx";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { PickerDisabledToast } from "../../../../ui/alert/presets/toast/index.ts";

export type DropdownPickerControllerProps = {
    selectedItem: PickerItemType | null
    toggleDropdown: () => void
    icon?: string
    inputPlaceholder?: string
    disabled?: boolean
    disabledText?: string
}

const DropdownPickerController: React.FC<DropdownPickerControllerProps> = ({
    selectedItem,
    toggleDropdown,
    icon,
    inputPlaceholder = "Válasszon a listából",
    disabled,
    disabledText
}) => {
    const { openToast } = useAlert();
    const controllerValue = selectedItem?.title ?? selectedItem?.value ?? "";

    const onPress = () => {
        if(disabled) return openToast(PickerDisabledToast.warning(disabledText));

        toggleDropdown();
    };

    return (
        <TouchableOpacity
            onPress={ onPress }
            style={ { flex: 1 } }
        >
            <TextInput
                value={ controllerValue }
                placeholder={ inputPlaceholder }
                icon={ icon }
                actionIcon={ ICON_NAMES.downArrowHead }
                editable={ false }
            />
        </TouchableOpacity>
    );
};

export default DropdownPickerController;