import { useForm } from "react-hook-form";
import {
    ServiceItemFormFields,
    ServiceItemFormTransformedFields,
    useServiceItemFormProps
} from "../../schemas/form/serviceItemForm.ts";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { StyleSheet, Text, View } from "react-native";
import { ServiceItemTypeInput } from "./inputFields/ServiceItemTypeInput.tsx";
import { AmountInput } from "../../../../../_shared/currency/components/AmountInput.tsx";
import React from "react";
import { SaveButton } from "../../../../../../components/Button/presets/SaveButton.tsx";
import { COLORS, FONT_SIZES } from "../../../../../../constants";
import Form from "../../../../../../components/Form/Form.tsx";
import { useTranslation } from "react-i18next";
import { ArrayInputToast, InvalidFormToast } from "../../../../../../ui/alert/presets/toast";
import { formTheme } from "../../../../../../ui/form/constants/theme.ts";
import { Currency } from "../../../../../_shared/currency/schemas/currencySchema.ts";

type ServiceItemFormProps = {
    carCurrency: Currency
    onSubmit: (result: ServiceItemFormTransformedFields) => void
    defaultServiceItem?: ServiceItemFormTransformedFields | null
}

export function ServiceItemForm({ carCurrency, onSubmit, defaultServiceItem }: ServiceItemFormProps) {
    const { t } = useTranslation();
    const { openToast } = useAlert();
    const { serviceItemDao } = useDatabase();

    const form = useForm<ServiceItemFormFields, any, ServiceItemFormFields>(useServiceItemFormProps({
        carCurrencyId: carCurrency.id,
        serviceItem: defaultServiceItem
    }));

    const { control, setValue, handleSubmit } = form;

    const submitHandler = handleSubmit(
        async (formResult) => {
            try {
                const result = await serviceItemDao.mapper.toFormTransformedFields(
                    formResult,
                    carCurrency.id
                );

                onSubmit(result);
            } catch(e) {
                openToast(ArrayInputToast.error());
                console.error("Hiba a submitHandler-ben log:", e);
            }
        },
        (errors) => {
            console.log("Service item form validation errors", errors);
            openToast(InvalidFormToast.warning());
        }
    );

    return (
        <View style={ styles.container }>
            <Text style={ styles.title }>{ t("service.items.title_singular") }</Text>
            <Form
                form={ form }
                formFields={
                    [
                        <ServiceItemTypeInput
                            control={ control }
                            fieldName="typeId"
                        />,
                        <AmountInput
                            control={ control }
                            setValue={ setValue }
                            fieldName="expense"
                            title={ t("currency.price_per_unit") }
                            amountPlaceholder={ t("currency.price_per_unit") }
                            isPricePerUnitFallback={ true }
                            showsQuantityInput={ true }
                            defaultCurrency={ carCurrency }
                        />
                    ]
                }
                containerStyle={ styles.formContainer }
            />
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