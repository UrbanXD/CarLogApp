import React from "react";
import { TouchableOpacity } from "react-native";
import Input from "../Input.ts";
import { ICON_NAMES } from "../../../constants/index.ts";
import { useDropdownPickerContext } from "../../../contexts/dropdownPicker/DropdownPickerContext.ts";
import SearchBar from "../../SearchBar.tsx";

const PickerDropdownInput: React.FC = () => {
    const {
        selectedElement,
        toggleDropdown,
        searchTerm,
        setSearchTerm,
        icon,
        inputPlaceholder,
        searchBarPlaceholder,
        horizontal,
        showElements,
        alwaysShowInput
    } = useDropdownPickerContext();

    const arrows =
        horizontal
        ? [ICON_NAMES.rightArrowHead, ICON_NAMES.leftArrowHead]
        : [ICON_NAMES.downArrowHead, ICON_NAMES.upArrowHead];
    const actionIcon = arrows[!showElements ? 0 : 1];

    const onPress = () => {
        if(toggleDropdown) toggleDropdown();
    };

    if(!alwaysShowInput && showElements) return <></>;

    if(showElements) {
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
            disabled={ showElements }
        >
            <Input.Text
                value={ selectedElement?.title }
                placeholder={ inputPlaceholder }
                icon={ icon }
                actionIcon={ actionIcon }
                editable={ false }
            />
        </TouchableOpacity>
    );
};

export default PickerDropdownInput;