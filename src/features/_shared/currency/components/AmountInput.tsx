import Input from "../../../../components/Input/Input.ts";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../../../constants";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Control, FieldPath, FieldValues, UseFormSetValue, useWatch } from "react-hook-form";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { formTheme } from "../../../..//ui/form/constants/theme.ts";
import { numberToFractionDigit } from "../../../../utils/numberToFractionDigit.ts";
import { useTranslation } from "react-i18next";
import { Currency } from "../schemas/currencySchema.ts";
import { AmountInCarCurrency } from "./AmountInCarCurrency.tsx";
import { PricePerUnitTotalCostInCarCurrency } from "./PricePerUnitTotalCostInCarCurrency.tsx";
import { CurrencyInput } from "./CurrencyInput.tsx";
import { formatWithUnit } from "../../../../utils/formatWithUnit.ts";

type AmountInputProps<TFieldValues extends FieldValues> = {
    control: Control<TFieldValues>
    setValue: UseFormSetValue<TFieldValues>
    fieldName: FieldPath<TFieldValues>
    title?: string
    subtitle?: string
    carIdFieldName?: FieldPath<TFieldValues>
    outsideQuantityFieldName?: FieldPath<TFieldValues>
    amountPlaceholder?: string
    showsExchangeRateInput?: boolean
    showsQuantityInput?: boolean
    showsIsPricePerUnitInput?: boolean
    isPricePerUnitFallback?: boolean
    defaultCurrency?: Currency | null
}

export function AmountInput<TFieldValues extends FieldValues>({
    control,
    setValue,
    fieldName,
    title,
    subtitle,
    carIdFieldName,
    outsideQuantityFieldName,
    amountPlaceholder,
    showsExchangeRateInput = true,
    showsQuantityInput = false,
    showsIsPricePerUnitInput = false,
    isPricePerUnitFallback = false,
    defaultCurrency
}: AmountInputProps<TFieldValues>) {
    const { t } = useTranslation();
    const { currencyDao } = useDatabase();

    const latestExchangeRate = useRef(1);

    const amountFieldName = `${ fieldName }.amount` as FieldPath<TFieldValues>;
    const currencyFieldName = `${ fieldName }.currencyId` as FieldPath<TFieldValues>;
    const exchangeRateFieldName = `${ fieldName }.exchangeRate` as FieldPath<TFieldValues>;
    const quantityFieldName = outsideQuantityFieldName ?? `${ fieldName }.quantity` as FieldPath<TFieldValues>;
    const isPricePerUnitFieldName = `${ fieldName }.isPricePerUnit` as FieldPath<TFieldValues>;

    const formCarId = useWatch({ control, name: carIdFieldName ?? "" as FieldPath<TFieldValues> });
    const formCurrency = useWatch({ control, name: currencyFieldName });
    const formAmount = useWatch({ control, name: amountFieldName });
    const formExchangeRate = useWatch({ control, name: exchangeRateFieldName });
    const formQuantity = useWatch({ control, name: quantityFieldName });
    const formIsPricePerUnit = useWatch({ control, name: isPricePerUnitFieldName });

    const carId = useMemo(() => formCarId ?? null, [formCarId]);
    const isPricePerUnit = useMemo(
        () => showsIsPricePerUnitInput ? formIsPricePerUnit : !!isPricePerUnitFallback,
        [formIsPricePerUnit, showsIsPricePerUnitInput, isPricePerUnitFallback]
    );

    const [carCurrency, setCarCurrency] = useState<Currency | null>(null);
    const [currency, setCurrency] = useState<Currency | null>(null);

    useEffect(() => {
        let ignore = false;

        async function updateCurrencies() {
            const [currencyResult, carCurrencyResult] = await Promise.all([
                formCurrency ? currencyDao.getById(formCurrency) : Promise.resolve(null),
                carId ? currencyDao.getCarCurrency(carId) : Promise.resolve(defaultCurrency ?? null)
            ]);

            if(ignore) return;

            setCurrency(currencyResult);
            setCarCurrency(carCurrencyResult);

            if(formCurrency && carCurrencyResult) {
                const isSameCurrency = formCurrency.toString() === carCurrencyResult.id.toString();

                if(isSameCurrency) {
                    if(formExchangeRate !== 1) latestExchangeRate.current = formExchangeRate;
                    setValue(exchangeRateFieldName, 1 as any);
                } else {
                    if(formExchangeRate === 1 && latestExchangeRate.current !== 1) setValue(
                        exchangeRateFieldName,
                        latestExchangeRate.current as any
                    );
                }
            }
        }

        updateCurrencies();

        return () => { ignore = true; };
    }, [formCurrency, carId]);

    const getExchangedAmount = useCallback(() => {
        let exchangedAmount = 0;
        if(formAmount && !isNaN(Number(formAmount))) {
            exchangedAmount = numberToFractionDigit(Number(formAmount) * Number(formExchangeRate ?? 1));
        }

        return formatWithUnit(`${ exchangedAmount }\u00A0`, carCurrency?.symbol); // "\u00A0" - for prevent only currency wrap to the next line
    }, [formAmount, formExchangeRate, carCurrency, currency]);

    const getTotalAmountTextByPricePerUnit = useCallback(() => {
        const quantity = (quantityFieldName && formQuantity && !isNaN(Number(formQuantity)))
                         ? Number(formQuantity)
                         : 1;

        const rawAmount = (formAmount && !isNaN(Number(formAmount))) ? Number(formAmount) : 0;
        const totalAmount = quantity * rawAmount;
        const totalExchangedAmount = totalAmount * Number(formExchangeRate ?? 1);

        const amountText = formatWithUnit(totalAmount, currency?.symbol);

        const carAmountText = (carCurrency && currency && carCurrency.id !== currency.id)
                              ? formatWithUnit(totalExchangedAmount, carCurrency.symbol)
                              : undefined;

        return (
            <PricePerUnitTotalCostInCarCurrency
                amountText={ amountText }
                carAmountText={ carAmountText }
            />
        );
    }, [
        formAmount,
        formQuantity,
        formExchangeRate,
        currency,
        carCurrency,
        quantityFieldName
    ]);
    return (
        <Input.Field
            control={ control }
            fieldName={ fieldName }
            fieldNameText={ title ?? t("currency.cost") }
            fieldInfoText={
                subtitle
                ??
                (
                    (
                        isPricePerUnitFallback &&
                        (!isNaN(Number(formQuantity)) && Number(formQuantity) > 1)
                    )
                    ? getTotalAmountTextByPricePerUnit()
                    : undefined
                )
            }
            containerStyle={ styles.container }
        >
            {
                showsIsPricePerUnitInput &&
               <Input.Field
                  control={ control }
                  fieldName={ isPricePerUnitFieldName }
               >
                  <View style={ styles.isPricePerUnitContainer }>
                     <Input.Switch label={ { on: t("currency.price_per_unit"), off: t("currency.total_cost") } }/>
                      {
                          isPricePerUnit &&
                         <View style={ styles.isPricePerUnitTextContainer }>
                            <Text style={ styles.label }>
                                { getTotalAmountTextByPricePerUnit() }
                            </Text>
                         </View>
                      }
                  </View>
               </Input.Field>
            }
            <View style={ styles.quantityAmountContainer }>
                {
                    showsQuantityInput &&
                   <View style={ styles.quantityContainer }>
                      <Input.Row
                         errorFieldNames={ [quantityFieldName] }
                         style={ { gap: 0 } }
                      >
                         <View style={ { flex: 1 } }>
                            <Input.Field
                               control={ control }
                               fieldName={ quantityFieldName }
                               hideError
                            >
                               <Input.Text
                                  placeholder={ "1" }
                                  keyboardType="numeric"
                                  type="secondary"
                               />
                            </Input.Field>
                         </View>
                         <Text style={ styles.quantityCountText }>{ t("common.count") }</Text>
                      </Input.Row>
                   </View>
                }
                <Input.Row
                    errorFieldNames={ [amountFieldName, currencyFieldName] }
                    style={ { gap: 0 } }
                >
                    <View style={ styles.amountContainer }>
                        <View style={ styles.amountContent }>
                            <Input.Field
                                control={ control }
                                fieldName={ amountFieldName }
                                hideError
                            >
                                <Input.Text
                                    icon={ ICON_NAMES.money }
                                    placeholder={ amountPlaceholder ?? t("currency.cost") }
                                    keyboardType="numeric"
                                    type="secondary"
                                />
                            </Input.Field>
                        </View>
                        <CurrencyInput
                            control={ control }
                            fieldName={ currencyFieldName }
                            getPickerControllerTitle={ (entity) => String(entity.symbol) }
                            hideError
                            hiddenBackground
                        />
                    </View>
                </Input.Row>
            </View>
            {
                showsExchangeRateInput && (carCurrency && carCurrency.id !== currency?.id) &&
               <View style={ styles.exchangeContainer }>
                  <View style={ styles.exchangeTextContainer }>
                     <Text style={ styles.label }>
                        <AmountInCarCurrency amountText={ getExchangedAmount() } isPricePerUnit={ isPricePerUnit }/>
                     </Text>
                  </View>
                  <View style={ styles.exchangeInputContainer }>
                     <Input.Row
                        errorFieldNames={ [exchangeRateFieldName] }
                        style={ styles.exchangeInputRow }
                     >
                        <View style={ styles.exchangeLabel }>
                           <Text style={ styles.exchangeLabelBaseText }>1</Text>
                            {
                                currency &&
                               <Text style={ styles.labelCurrencyText }>
                                   { currency.symbol }
                               </Text>
                            }
                           <Text style={ styles.labelArrow }>⇄</Text>
                        </View>
                        <Input.Field
                           control={ control }
                           fieldName={ exchangeRateFieldName }
                           hideError
                           style={ { flex: 1 } }
                        >
                           <Input.Text
                              placeholder="1.0"
                              keyboardType="numeric"
                              type="secondary"
                           />
                        </Input.Field>
                         {
                             carCurrency &&
                            <Text style={ styles.labelCurrencyText }>
                                { carCurrency.symbol }
                            </Text>
                         }
                     </Input.Row>
                  </View>
               </View>
            }
        </Input.Field>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: SEPARATOR_SIZES.lightSmall
    },
    isPricePerUnitContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: SEPARATOR_SIZES.lightSmall
    },
    isPricePerUnitTextContainer: {
        flexShrink: 1,
        height: "100%"
    },
    quantityAmountContainer: {
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall
    },
    quantityContainer: {
        flex: 0.4
    },
    quantityCountText: {
        alignSelf: "flex-end",
        marginBottom: SEPARATOR_SIZES.small,
        fontSize: formTheme.valueTextFontSize / 1.35,
        color: COLORS.gray1
    },
    amountContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: SEPARATOR_SIZES.lightSmall / 2
    },
    amountContent: {
        flex: 1
    },
    label: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3,
        color: COLORS.gray1,
        lineHeight: FONT_SIZES.p2,
        letterSpacing: FONT_SIZES.p2 * 0.05
    },
    exchangeContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: SEPARATOR_SIZES.lightSmall
    },
    exchangeTextContainer: {
        flex: 1
    },
    exchangeInputContainer: {
        flex: 0.55
    },
    exchangeInputRow: {
        flex: 0,
        alignItems: "center",
        gap: 0
    },
    exchangeLabel: {
        flexDirection: "row",
        alignItems: "center"
    },
    exchangeLabelBaseText: {
        fontSize: formTheme.valueTextFontSize,
        color: formTheme.valueTextColor,
        marginRight: 2
    },
    labelArrow: {
        fontSize: formTheme.valueTextFontSize,
        color: COLORS.gray1,
        fontWeight: 600,
        marginLeft: 2,
        marginBottom: formTheme.valueTextFontSize / 4
    },
    labelCurrencyText: {
        fontSize: formTheme.valueTextFontSize / 1.35,
        color: COLORS.gray1
    }
});