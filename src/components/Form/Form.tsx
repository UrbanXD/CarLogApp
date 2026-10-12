import React, { ReactElement, ReactNode, useEffect, useMemo } from "react";
import { Platform, View } from "react-native";
import { FormState, UseFormReturn } from "react-hook-form";
import { formTheme } from "../../ui/form/constants/theme.ts";
import { FormButtons } from "../Button/presets/FormButtons.tsx";
import { SubmitHandlerArgs, ViewStyle } from "../../types";
import { SEPARATOR_SIZES } from "../../constants";
import { useBottomSheet } from "../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { FlatList } from "react-native-gesture-handler";
import { WEB_SCROLLBAR_STYLE } from "../screenView/webScrollbarStyle";
import { useDesktopWeb } from "../../hooks/useDesktopWeb";

type FormProps = {
    form: UseFormReturn<any>
    formFields: ReactNode | Array<ReactNode>
    submitHandler?: SubmitHandlerArgs<any>
    edit?: boolean
    onFormStateChange?: (formState: FormState<any>) => void
    submitText?: string
    containerStyle?: ViewStyle
}

export function Form({
    form,
    formFields,
    submitHandler,
    edit,
    onFormStateChange,
    submitText,
    containerStyle
}: FormProps) {
    const showWebScrollbar = useDesktopWeb();
    const { availableContentHeight } = useBottomSheet();

    useEffect(() => {
        if(onFormStateChange) onFormStateChange(form.formState);
    }, [form.formState]);

    const submit = useMemo(() => {
        if(!submitHandler) return null;
        return form.handleSubmit(submitHandler.onValid, submitHandler.onInvalid);
    }, [form, submitHandler]);

    return (
        <View style={ [
            { flex: 1, maxHeight: availableContentHeight, gap: formTheme.gap },
            Platform.OS === "web" && styles.webFormContainer
        ] }>
            <FlatList
                data={ React.Children.toArray(formFields) }
                renderItem={ ({ item }) => item as ReactElement }
                keyExtractor={ (_, index) => index.toString() }
                contentContainerStyle={ [
                    {
                        flexGrow: 1,
                        width: "100%",
                        alignSelf: "stretch",
                        minWidth: 0,
                        justifyContent: "flex-start",
                        gap: formTheme.gap,
                        paddingBottom: SEPARATOR_SIZES.lightSmall
                    },
                    containerStyle
                ] }
                style={ Platform.OS === "web"
                        ? [styles.webFormList, showWebScrollbar && WEB_SCROLLBAR_STYLE]
                        : undefined }
                showsVerticalScrollIndicator={ showWebScrollbar }
            />
            {
                submitHandler && submit &&
               <FormButtons
                  submit={ submit }
                  reset={ edit ? form.reset : undefined }
                  submitText={ submitText }
               />
            }
        </View>
    );
}

const styles = {
    webFormContainer: {
        width: "100%" as const,
        maxWidth: "100%" as const,
        minWidth: 0,
        boxSizing: "border-box" as const
    },
    webFormList: { width: "100%" as const, maxWidth: "100%" as const, minWidth: 0, boxSizing: "border-box" as const }
};

export default Form;
