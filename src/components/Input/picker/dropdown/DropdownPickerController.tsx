import React from "react";
import { TextStyle, TouchableOpacity } from "react-native";
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
    type?: "primary" | "secondary"
    textInputStyle?: TextStyle
}

const DropdownPickerController: React.FC<DropdownPickerControllerProps> = ({
    selectedItem,
    toggleDropdown,
    icon,
    inputPlaceholder = "Válasszon a listából",
    disabled,
    disabledText,
    type,
    textInputStyle
}) => {
    const { openToast } = useAlert();
    const controllerValue = selectedItem?.controllerTitle ?? selectedItem?.title ?? selectedItem?.value ?? "";

    const onPress = () => {
        if(disabled) return openToast(PickerDisabledToast.warning(disabledText));

        toggleDropdown();
    };

    return (
        <TouchableOpacity onPress={ onPress }>
            <TextInput
                value={ controllerValue }
                placeholder={ inputPlaceholder }
                icon={ icon }
                actionIcon={ ICON_NAMES.downArrowHead }
                editable={ false }
                type={ type }
                textInputStyle={ [textInputStyle, { flex: 1 }] }
            />
        </TouchableOpacity>
    );
};

export default DropdownPickerController;