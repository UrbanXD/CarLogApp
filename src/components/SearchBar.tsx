import React, { useState } from "react";
import { ICON_NAMES } from "../constants/index.ts";
import Input from "./Input/Input.ts";

interface SearchBarProps {
    onTextChange: (value: any) => void;
    term?: string;
    onClose?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    onTextChange,
    term = "",
    onClose
}) => {
    const [value, setValue] = useState(term);

    const updateValue = () => {
        onTextChange(value);
        setValue(value);
    };

    return (
        <Input.Text
            value={ value }
            setValue={ updateValue }
            actionIcon={ ICON_NAMES.close }
            onAction={ onClose }
        />
    );
};

export default SearchBar;