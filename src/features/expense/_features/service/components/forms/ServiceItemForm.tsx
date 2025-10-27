import { ServiceItem } from "../../schemas/serviceItemSchema.ts";
import { useForm } from "react-hook-form";
import { ServiceItemFields, useServiceItemFormProps } from "../../schemas/form/serviceItemForm.ts";
import { CarCreateToast } from "../../../../../car/presets/toast/index.ts";
import { useAlert } from "../../../../../../ui/alert/hooks/useAlert.ts";
import { useDatabase } from "../../../../../../contexts/database/DatabaseContext.ts";
import { StyleSheet, Text, View } from "react-native";
import { ServiceItemTypeInput } from "./inputFields/ServiceItemTypeInput.tsx";
import { AmountInput } from "../../../../../_shared/currency/components/AmountInput.tsx";
import React, { useCallback } from "react";
import { SaveButton } from "../../../../../../components/Button/presets/SaveButton.tsx";
import { COLORS, FONT_SIZES, SEPARATOR_SIZES } from "../../../../../../constants/index.ts";

type ServiceItemFormProps = {
    carCurrencyId: number
    onSubmit: (result: Omit<ServiceItem, "serviceLogId" | "carId">) => void
    serviceItem?: ServiceItem
}

export function ServiceItemForm({ carCurrencyId, serviceItem, onSubmit }: ServiceItemFormProps) {
    const { openToast } = useAlert();
    const { serviceItemDao } = useDatabase();

    const form = useForm<ServiceItemFields>(useServiceItemFormProps({ carCurrencyId, serviceItem }));
    const { control, setValue, handleSubmit, getValues } = form;

    const submitHandler = handleSubmit(
        async (formResult: ServiceItemFields) => {
            try {
                const result = await serviceItemDao.mapper.formResultToDto({
                    ...formResult,
                    carCurrencyId: carCurrencyId
                });

                onSubmit(result);

            } catch(e) {
                openToast(CarCreateToast.error());
                console.error("Hiba a submitHandler-ben log:", e);
            }
        },
        (errors) => {
            console.log("Service item form validation errors", errors);
            openToast(CarCreateToast.error());
        }
    );

    const amountFieldExchangeText = useCallback((exchangedAmount: string) => {
        return (
            <>
                Az autó alapvalutájában számolt egységár{ " " }
                <Text style={ { fontWeight: "bold" } }>{ exchangedAmount }</Text>
            </>
        );
    }, []);

    return (
        <View style={ styles.container }>
            <Text style={ styles.title }>Szervizelési tétel</Text>
            <ServiceItemTypeInput
                control={ control }
                fieldName="typeId"
            />
            <AmountInput
                control={ control }
                setValue={ setValue }
                title={ "Egységár" }
                amountPlaceholder={ "Egységár" }
                amountFieldName="pricePerUnit"
                currencyFieldName="currencyId"
                quantityFieldName="quantity"
                exchangeRateFieldName="exchangeRate"
                exchangeText={ amountFieldExchangeText }
                defaultCurrency={ carCurrencyId }
            />
            <SaveButton onPress={ submitHandler }/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignSelf: "center",
        gap: SEPARATOR_SIZES.lightSmall,
        paddingBottom: SEPARATOR_SIZES.lightSmall
    },
    title: {
        fontFamily: "Gilroy-Heavy",
        fontSize: FONT_SIZES.p1,
        color: COLORS.white,
        textAlign: "center"
    }
});