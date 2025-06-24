import React from "react";
import PickerDropdownInput from "./PickerDropdownInput.tsx";
import DropdownPickerElements from "./DropdownPickerElements.tsx";
import {
    DropdownPickerProvider,
    DropdownPickerProviderProps
} from "../../../contexts/dropdownPicker/DropdownPickerProvider.tsx";

const DropdownPicker: React.FC<DropdownPickerProviderProps> = (props) => {
    return (
        <DropdownPickerProvider value={ props }>
            <PickerDropdownInput/>
            <DropdownPickerElements/>
        </DropdownPickerProvider>
    );
};

export default DropdownPicker;