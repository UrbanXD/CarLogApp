import React from "react";
import { ICON_NAMES } from "../constants/index.ts";
import TextInput, { TextInputProps } from "./Input/text/TextInput.tsx";

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
        <TextInput
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