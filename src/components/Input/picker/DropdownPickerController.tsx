import React from "react";
import { TouchableOpacity } from "react-native";
import Input from "../Input.ts";
import { ICON_NAMES } from "../../../constants/index.ts";
import { useDropdownPickerContext } from "../../../contexts/dropdownPicker/DropdownPickerContext.ts";

export type DropdownPickerControllerProps = {
    icon?: string
    inputPlaceholder?: string
}

const DropdownPickerController: React.FC<DropdownPickerControllerProps> = ({
    icon,
    inputPlaceholder = "Válasszon a listából"
}) => {
    const {
        selectedItem,
        toggleDropdown,
        showItems,
        alwaysShowInput
    } = useDropdownPickerContext();

    const arrows = [ICON_NAMES.downArrowHead, ICON_NAMES.upArrowHead];
    const actionIcon = arrows[!showItems ? 0 : 1];
    const controllerValue = selectedItem?.title ?? selectedItem?.value ?? "";

    const onPress = () => {
        if(toggleDropdown) toggleDropdown();
    };

    if(!alwaysShowInput && showItems) return <></>;

    return (
        <TouchableOpacity
            onPress={ onPress }
            style={ { flex: 1 } }
        >
            <Input.Text
                value={ controllerValue }
                placeholder={ inputPlaceholder }
                icon={ icon }
                actionIcon={ actionIcon }
                editable={ false }
                alwaysFocused={ showItems }
            />
        </TouchableOpacity>
    );
};

export default DropdownPickerController;