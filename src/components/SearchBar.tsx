import React from "react";
import { ICON_NAMES } from "../constants/index.ts";
import Input from "./Input/Input.ts";
import { TextInputProps } from "./Input/text/TextInput.tsx";

type SearchBarProps = {
    setTerm: (value: string) => void
    term: string
    textInputProps?: TextInputProps
}

const SearchBar: React.FC<SearchBarProps> = ({
    setTerm,
    term,
    textInputProps
}) => {
    const placeholder = textInputProps?.placeholder ?? "Keresés...";

    return (
        <Input.Text
            value={ term }
            setValue={ setTerm }
            { ...textInputProps }
            icon={ ICON_NAMES.search }
            placeholder={ placeholder }
            allowInputFieldContext={ false }
        />
    );
};

export default SearchBar;