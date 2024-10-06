import React, { useState } from "react";
import { ICON_NAMES } from "../../constants/constants";
import TextInput from "../input/InputText/TextInput";

interface SearchBarProps {
    onTextChange: (value: any) => void
    term?: string
    onClose?: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({
    onTextChange,
    term= "",
    onClose
}) => {
    const [value, setValue] = useState(term)

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