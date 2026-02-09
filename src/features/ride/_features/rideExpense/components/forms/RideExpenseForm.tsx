import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { useForm } from "react-hook-form";
import {
    RideExpenseFormFields,
    RideExpenseFormTransformedFields,
    useRideExpenseFormProps
} from "../../schemas/form/rideExpenseForm.ts";
import { StyleSheet, Text, View } from "react-native";
import { ExpenseTypeInput } from "../../../../../expense/components/forms/inputFields/ExpenseTypeInput.tsx";
import React from "react";
import { SaveButton } from "../../../../../../components/Button/presets/SaveButton.tsx";
import { COLORS, FONT_SIZES } from "../../../../../../constants";
import { AmountInput } from "../../../../../_shared/currency/components/AmountInput.tsx";
import { Car } from "../../../../../car/schemas/carSchema.ts";
import Input from "../../../../../../components/Input/Input.ts";
import InputDatePicker from "../../../../../../components/Input/datePicker/InputDatePicker.tsx";
import { NoteInput } from "../../../../../../components/Input/_presets/NoteInput.tsx";
import { useTranslation } from "react-i18next";
import { ArrayInputToast, InvalidFormToast } from "../../../../../../ui/alert/presets/toast";
import { formTheme } from "../../../../../../ui/form/constants/theme.ts";
import Form from "../../../../../../components/Form/Form.tsx";

type RideExpenseFormProps = {
    car: Car
    onSubmit: (result: RideExpenseFormTransformedFields) => void
    defaultRideExpense?: RideExpenseFormTransformedFields
    defaultDate?: string
}

export function RideExpenseForm({ car, onSubmit, defaultRideExpense, defaultDate }: RideExpenseFormProps) {
    const { t } = useTranslation();
    const { openToast } = useAlert();
    const { rideLogDao } = useDatabase();

    const form = useForm<RideExpenseFormFields, any, RideExpenseFormFields>(useRideExpenseFormProps({
        rideExpense: defaultRideExpense,
        defaultCurrencyId: car.currency.id,
        defaultDate: defaultDate
    }));

    const { control, setValue, handleSubmit } = form;

    const submitHandler = handleSubmit(
        async (formResult) => {
            try {
                const result = await rideLogDao.rideExpenseMapper.toFormTransformedFields(formResult, car);

                onSubmit(result);
            } catch(e) {
                openToast(ArrayInputToast.error());
                console.error("Hiba a submitHandler-ben log:", e);
            }
        },
        (errors) => {
            console.log("Ride expense form validation errors", errors);
            openToast(InvalidFormToast.warning());
        }
    );

    return (
        <View style={ styles.container }>
            <Text style={ styles.title }>{ t("rides.other_expense") }</Text>
            <Form
                form={ form }
                formFields={
                    [
                        <ExpenseTypeInput
                            control={ control }
                            fieldName="typeId"
                        />,
                        <AmountInput
                            control={ control }
                            setValue={ setValue }
                            fieldName="expense"
                            defaultCurrency={ car.currency }
                        />,
                        <Input.Field
                            control={ control }
                            fieldName="date"
                            fieldNameText={ t("date.text") }
                        >
                            <InputDatePicker/>
                        </Input.Field>,
                        <NoteInput
                            control={ control }
                            setValue={ setValue }
                            fieldName="note"
                        />
                    ]
                }
                containerStyle={ styles.formContainer }
            >
            </Form>
            <SaveButton onPress={ submitHandler }/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignSelf: "center",
        gap: formTheme.gap
    },
    formContainer: {
        flex: 1,
        width: "100%",
        alignSelf: "center",
        gap: formTheme.gap,
        overflow: "hidden"
    },
    title: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p1,
        color: COLORS.white,
        textAlign: "center"
    }
});