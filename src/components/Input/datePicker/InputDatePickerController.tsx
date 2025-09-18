import { Pressable } from "react-native";
import { ICON_NAMES } from "../../../constants/index.ts";
import { InputRow } from "../common/InputRow.tsx";
import TextInput from "../text/TextInput.tsx";
import React, { useCallback } from "react";
import Divider from "../../Divider.tsx";
import { formTheme } from "../../../ui/form/constants/theme.ts";
import { DatePickerViews } from "../../../contexts/datePicker/DatePickerContext.ts";
import dayjs from "dayjs";

type InputDatePickerControllerProps = {
    date: dayjs.Dayjs
    open: (view: DatePickerViews) => void
    expanded: boolean
}

export function InputDatePickerController({ date, open, expanded }: InputDatePickerControllerProps) {
    const onPressDate = useCallback(() => open("calendar"));
    const onPressTime = useCallback(() => open("time"));

    return (
        <InputRow focused={ expanded }>
            <Pressable
                onPress={ onPressDate }
                style={ { flex: 1 } }
            >
                <TextInput
                    value={ date.format("YYYY. MMM DD.") }
                    type="secondary"
                    icon={ ICON_NAMES.calendar }
                    editable={ false }
                    alwaysFocused={ true }
                />
            </Pressable>
            <Divider isVertical size={ formTheme.containerHeight } color={ formTheme.activeColor }/>
            <Pressable
                onPress={ onPressTime }
                style={ { flex: 0.45 } }
            >
                <TextInput
                    value={ date.format("HH:mm") }
                    placeholder="00:00"
                    type="secondary"
                    actionIcon={ ICON_NAMES.clock }
                    textInputStyle={ { textAlign: "right" } }
                    editable={ false }
                    alwaysFocused={ true }
                />
            </Pressable>
        </InputRow>
    );
}