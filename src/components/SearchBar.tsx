import React, {useState} from "react";
import {ICON_NAMES} from "../constants/constants";
import TextInput from "./Input/InputText/TextInput";

interface SearchBarProps {
    onTextChange: (value: any) => void
    onClose?: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onTextChange, onClose }) => {
    const [value, setValue] = useState("")

    return (
        <TextInput
            value={ value }
            setValue={(text: string) => {
                setValue(text)
                onTextChange(text)
            }}
            actionIcon={ ICON_NAMES.close }
            onAction={ onClose }
            icon={ ICON_NAMES.search }
        />
    )
}

export default SearchBar;