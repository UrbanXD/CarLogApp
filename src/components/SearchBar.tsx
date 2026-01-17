import React from "react";
import { ICON_NAMES } from "../constants/index.ts";
import TextInput, { TextInputProps } from "./Input/text/TextInput.tsx";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();
    const placeholder = textInputProps?.placeholder ?? t("form.searchbar.placeholder");

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