import React from "react";
import { TouchableOpacity } from "react-native";
import Input from "../Input.ts";
import { ICON_NAMES } from "../../../constants/index.ts";
import { useDropdownPickerContext } from "../../../contexts/dropdownPicker/DropdownPickerContext.ts";
import SearchBar from "../../SearchBar.tsx";

export type DropdownPickerControllerProps = {
    icon?: string
    inputPlaceholder?: string
    searchBarPlaceholder?: string
}

const DropdownPickerController: React.FC<DropdownPickerControllerProps> = ({
    icon,
    inputPlaceholder = "Válasszon a listából",
    searchBarPlaceholder
}) => {
    const {
        selectedItem,
        toggleDropdown,
        searchTerm,
        setSearchTerm,
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

    if(showItems) {
        return (
            <SearchBar
                term={ searchTerm }
                setTerm={ setSearchTerm }
                textInputProps={ {
                    placeholder: searchBarPlaceholder,
                    actionIcon: actionIcon,
                    onAction: onPress,
                    alwaysFocused: true
                } }
            />
        );
    }

    return (
        <TouchableOpacity
            onPress={ onPress }
            disabled={ showItems }
            style={ { flex: 1 } }
        >
            <Input.Text
                value={ controllerValue }
                placeholder={ inputPlaceholder }
                icon={ icon }
                actionIcon={ actionIcon }
                editable={ false }
            />
        </TouchableOpacity>
    );
};

export default DropdownPickerController;