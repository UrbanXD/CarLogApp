import React, { ReactElement, ReactNode, useEffect, useMemo } from "react";
import { View } from "react-native";
import { FormState, UseFormReturn } from "react-hook-form";
import { formTheme } from "../../ui/form/constants/theme.ts";
import { FormButtons } from "../Button/presets/FormButtons.tsx";
import { SubmitHandlerArgs, ViewStyle } from "../../types";
import { SEPARATOR_SIZES } from "../../constants";
import { useBottomSheet } from "../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import { FlatList } from "react-native-gesture-handler";

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
    const { availableContentHeight } = useBottomSheet();

    useEffect(() => {
        if(onFormStateChange) onFormStateChange(form.formState);
    }, [form.formState]);

    const submit = useMemo(() => {
        if(!submitHandler) return null;
        return form.handleSubmit(submitHandler.onValid, submitHandler.onInvalid);
    }, [form, submitHandler]);

    return (
        <View style={ { flex: 1, maxHeight: availableContentHeight, gap: formTheme.gap } }>
            <FlatList
                data={ React.Children.toArray(formFields) }
                renderItem={ ({ item }) => item as ReactElement }
                keyExtractor={ (_, index) => index.toString() }
                contentContainerStyle={ [
                    {
                        flexGrow: 1,
                        justifyContent: "flex-start",
                        gap: formTheme.gap,
                        paddingBottom: SEPARATOR_SIZES.lightSmall
                    },
                    containerStyle
                ] }
                showsVerticalScrollIndicator={ false }
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

export default Form;