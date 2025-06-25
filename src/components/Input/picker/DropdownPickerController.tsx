import React from "react";
import { TouchableOpacity } from "react-native";
import Input from "../Input.ts";
import { COLORS, FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../../constants/index.ts";
import { useDropdownPickerContext } from "../../../contexts/dropdownPicker/DropdownPickerContext.ts";
import SearchBar from "../../SearchBar.tsx";
import Icon from "../../Icon.tsx";

const DropdownPickerController: React.FC = () => {
    const {
        selectedElement,
        toggleDropdown,
        searchTerm,
        setSearchTerm,
        icon,
        inputPlaceholder,
        searchBarPlaceholder,
        showElements,
        horizontal,
        alwaysShowInput
    } = useDropdownPickerContext();

    const arrows = horizontal
                   ? [ICON_NAMES.rightArrowHead, ICON_NAMES.leftArrowHead]
                   : [ICON_NAMES.downArrowHead, ICON_NAMES.upArrowHead];
    const actionIcon = arrows[!showElements ? 0 : 1];
    const controllerValue = selectedElement && `${ selectedElement?.title }\n${ selectedElement?.subtitle }`;

    const onPress = () => {
        if(toggleDropdown) toggleDropdown();
    };

    if(!alwaysShowInput && showElements) return <></>;

    if(showElements && horizontal) {
        return (
            <Icon
                icon={ ICON_NAMES.close }
                size={ FONT_SIZES.h2 }
                color={ COLORS.white }
                style={ { alignSelf: "center", marginRight: SEPARATOR_SIZES.lightSmall } }
                onPress={ onPress }
            />
        );
    }

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
            style={ { flex: 1 } }
        >
            <Input.Text
                type={ horizontal && "secondary" }
                value={ controllerValue }
                placeholder={ inputPlaceholder }
                icon={ icon }
                actionIcon={ actionIcon }
                editable={ false }
                multiline={ horizontal }
            />
        </TouchableOpacity>
    );
};

export default DropdownPickerController;