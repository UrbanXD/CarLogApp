import React, {useState} from "react";
import {TextInput} from "react-native";
import InputText from "./Input/InputText/InputText";
import {ICON_NAMES} from "../constants/constants";

interface SearchBarProps {
    onTextChange: (value: any) => void
    onClose?: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onTextChange, onClose }) => {
    const [value, setValue] = useState("")

    return (
        <InputText
            value={ value }
            setValue={(text: string) => {
                setValue(text)
                onTextChange(text)
            }}
            iconButton={ onClose && ICON_NAMES.close }
            onIconButton={ onClose }
            icon={ ICON_NAMES.search }
        />
    )
}

export default SearchBar;