import { FormResultRideExpense, RideExpense } from "../../schemas/rideExpenseSchema.ts";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { useForm } from "react-hook-form";
import { RideExpenseFormFields, useRideExpenseFormProps } from "../../schemas/form/rideExpenseForm.ts";
import { StyleSheet, Text, View } from "react-native";
import { ExpenseTypeInput } from "../../../../../expense/components/forms/inputFields/ExpenseTypeInput.tsx";
import React from "react";
import { SaveButton } from "../../../../../../components/Button/presets/SaveButton.tsx";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../../../constants/index.ts";
import Form from "../../../../../../components/Form/Form.tsx";
import { AmountInput } from "../../../../../_shared/currency/components/AmountInput.tsx";
import { Car } from "../../../../../car/schemas/carSchema.ts";
import Input from "../../../../../../components/Input/Input.ts";
import InputDatePicker from "../../../../../../components/Input/datePicker/InputDatePicker.tsx";
import { NoteInput } from "../../../../../../components/Input/_presets/NoteInput.tsx";
import { useTranslation } from "react-i18next";
import { ArrayInputToast, InvalidFormToast } from "../../../../../../ui/alert/presets/toast/index.ts";

type RideExpenseFormProps = {
    car: Car
    onSubmit: (result: FormResultRideExpense) => void
    defaultRideExpense?: RideExpense
    defaultDate?: string
}

export function RideExpenseForm({ car, onSubmit, defaultRideExpense, defaultDate }: RideExpenseFormProps) {
    const { t } = useTranslation();
    const { openToast } = useAlert();
    const { rideExpenseDao } = useDatabase();

    const form = useForm<RideExpenseFormFields>(useRideExpenseFormProps({
        rideExpense: defaultRideExpense,
        defaultCurrencyId: car.currency.id,
        defaultDate: defaultDate
    }));
    const { control, setValue, handleSubmit } = form;

    const submitHandler = handleSubmit(
        async (formResult: RideExpenseFormFields) => {
            try {
                const result = await rideExpenseDao.mapper.formResultMapper({
                    ...formResult,
                    carId: car.id
                });

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
            <Form style={ styles.formContainer }>
                <ExpenseTypeInput
                    control={ control }
                    fieldName="typeId"
                />
                <AmountInput
                    control={ control }
                    setValue={ setValue }
                    amountFieldName="amount"
                    currencyFieldName="currencyId"
                    exchangeRateFieldName="exchangeRate"
                    defaultCurrency={ car.currency.id }
                />
                <Input.Field
                    control={ control }
                    fieldName="date"
                    fieldNameText={ t("date.text") }
                >
                    <InputDatePicker/>
                </Input.Field>
                <NoteInput
                    control={ control }
                    setValue={ setValue }
                    fieldName="note"
                />
            </Form>
            <SaveButton onPress={ submitHandler }/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignSelf: "center",
        gap: SEPARATOR_SIZES.lightSmall
    },
    formContainer: {
        flex: 1,
        overflow: "hidden"
    },
    title: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p1,
        color: COLORS.white,
        textAlign: "center"
    }
});