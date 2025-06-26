import React, { useEffect, useState } from "react";
import { ICON_NAMES } from "../constants/index.ts";
import Input from "./Input/Input.ts";
import { TextInputProps } from "./Input/text/TextInput.tsx";

interface SearchBarProps {
    setTerm: (value: string) => void;
    term?: string;
    textInputProps?: TextInputProps;
}

const SearchBar: React.FC<SearchBarProps> = ({
    setTerm,
    term = "",
    textInputProps
}) => {
    const [value, setValue] = useState(term);

    const placeholder = textInputProps?.placeholder ?? "Keresés...";

    useEffect(() => {
        setTerm(value);
    }, [value]);


    return (
        <Input.Text
            value={ value }
            setValue={ setValue }
            { ...textInputProps }
            icon={ ICON_NAMES.search }
            placeholder={ placeholder }
            allowInputFieldContext={ false }
        />
    );
};

export default SearchBar;