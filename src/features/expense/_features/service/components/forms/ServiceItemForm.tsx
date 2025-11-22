import { FormResultServiceItem, ServiceItem } from "../../schemas/serviceItemSchema.ts";
import { useForm } from "react-hook-form";
import { ServiceItemFields, useServiceItemFormProps } from "../../schemas/form/serviceItemForm.ts";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { StyleSheet, Text, View } from "react-native";
import { ServiceItemTypeInput } from "./inputFields/ServiceItemTypeInput.tsx";
import { AmountInput } from "../../../../../_shared/currency/components/AmountInput.tsx";
import React, { useCallback } from "react";
import { SaveButton } from "../../../../../../components/Button/presets/SaveButton.tsx";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../../../constants/index.ts";
import Form from "../../../../../../components/Form/Form.tsx";
import { useTranslation } from "react-i18next";
import { ArrayInputToast, InvalidFormToast } from "../../../../../../ui/alert/presets/toast/index.ts";

type ServiceItemFormProps = {
    carCurrencyId: number
    onSubmit: (result: FormResultServiceItem) => void
    defaultServiceItem?: ServiceItem
}

export function ServiceItemForm({ carCurrencyId, onSubmit, defaultServiceItem }: ServiceItemFormProps) {
    const { t } = useTranslation();
    const { openToast } = useAlert();
    const { serviceItemDao } = useDatabase();

    const form = useForm<ServiceItemFields>(useServiceItemFormProps({
        carCurrencyId,
        serviceItem: defaultServiceItem
    }));

    const { control, setValue, handleSubmit } = form;

    const submitHandler = handleSubmit(
        async (formResult: ServiceItemFields) => {
            try {
                const result = await serviceItemDao.mapper.formResultToDto({
                    ...formResult,
                    carCurrencyId: carCurrencyId
                });

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

    const amountFieldExchangeText = useCallback((exchangedAmount: string) => {
        return (
            <>
                { `${ t("currency.cost_in_car_currency") } ` }
                <Text style={ { fontWeight: "bold" } }>{ exchangedAmount }</Text>
            </>
        );
    }, []);

    return (
        <View style={ styles.container }>
            <Text style={ styles.title }>{ t("service.items.title_singular") }</Text>
            <Form style={ styles.formContainer }>
                <ServiceItemTypeInput
                    control={ control }
                    fieldName="typeId"
                />
                <AmountInput
                    control={ control }
                    setValue={ setValue }
                    title={ t("currency.price_per_unit") }
                    amountPlaceholder={ t("currency.price_per_unit") }
                    amountFieldName="pricePerUnit"
                    currencyFieldName="currencyId"
                    quantityFieldName="quantity"
                    exchangeRateFieldName="exchangeRate"
                    exchangeText={ amountFieldExchangeText }
                    defaultCurrency={ carCurrencyId }
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