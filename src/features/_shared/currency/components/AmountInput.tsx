import Input from "../../../../components/Input/Input.ts";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { MoreDataLoading } from "../../../../components/loading/MoreDataLoading.tsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import { PickerItemType } from "../../../../components/Input/picker/PickerItem.tsx";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { formTheme } from "../../../..//ui/form/constants/theme.ts";
import { numberToFractionDigit } from "../../../../utils/numberToFractionDigit.ts";
import { useTranslation } from "react-i18next";
import { Currency } from "../schemas/currencySchema.ts";
import { AmountInCarCurrency } from "./AmountInCarCurrency.tsx";
import { PricePerUnitTotalCostInCarCurrency } from "./PricePerUnitTotalCostInCarCurrency.tsx";

type AmountInputProps = {
    control: Control<any>
    setValue: UseFormSetValue<any>
    title?: string
    subtitle?: string
    amountPlaceholder?: string
    amountFieldName: string
    currencyFieldName: string
    quantityFieldName?: string
    isPricePerUnitFieldName?: string
    exchangeRateFieldName?: string
    showsExchangeRate?: boolean
    showsQuantityInput?: boolean
    defaultCurrency?: string | number
    isPricePerUnitFallback?: boolean
}

export function AmountInput({
    control,
    setValue,
    title,
    subtitle,
    amountPlaceholder,
    amountFieldName,
    currencyFieldName,
    quantityFieldName,
    isPricePerUnitFieldName,
    exchangeRateFieldName,
    showsExchangeRate = !!exchangeRateFieldName,
    showsQuantityInput = !!quantityFieldName,
    defaultCurrency,
    isPricePerUnitFallback = false
}: AmountInputProps) {
    const { t } = useTranslation();
    const { currencyDao } = useDatabase();

    const [rawCurrencies, setRawCurrencies] = useState<Array<Currency> | null>(null);
    const [currencies, setCurrencies] = useState<Array<PickerItemType>>([]);

    const latestExchangeRate = useRef(1);

    const formCurrency = useWatch({ control, name: currencyFieldName });
    const formAmount = useWatch({ control, name: amountFieldName });
    const formQuantity = useWatch({ control, name: quantityFieldName });
    const formExchangeRate = exchangeRateFieldName ? useWatch({ control, name: exchangeRateFieldName }) : null;
    const formIsPricePerUnit = isPricePerUnitFieldName
                               ? useWatch({ control, name: isPricePerUnitFieldName })
                               : isPricePerUnitFallback;

    useEffect(() => {
        (async () => {
            setRawCurrencies(await currencyDao.getAll());
        })();
    }, []);

    useEffect(() => {
        if(!rawCurrencies) return;

        setCurrencies(
            currencyDao.mapper.dtoToPicker({
                dtos: rawCurrencies,
                getControllerTitle: (dto) => dto.symbol,
                getTitle: (dto) => `${ t(`currency.names.${ dto.key }`) } - ${ dto.symbol }`
            })
        );

    }, [rawCurrencies, t]);

    useEffect(() => {
        if(!exchangeRateFieldName) return;

        if(formCurrency?.toString() === defaultCurrency?.toString()) {
            latestExchangeRate.current = formExchangeRate;
            setValue(exchangeRateFieldName, 1);
        } else if(formExchangeRate === 1 && latestExchangeRate.current !== 1) {
            setValue(exchangeRateFieldName, latestExchangeRate.current);
        }
    }, [formCurrency]);

    const getCurrencyText = useCallback((currencyId: string) => {
        const currency = currencies?.find((currency: PickerItemType) => currency.value === currencyId);

        return currency?.controllerTitle ?? currency?.title ?? "";
    }, [currencies]);

    const getExchangedAmount = useCallback(() => {
        const defaultCurrencyText = getCurrencyText(defaultCurrency?.toString());

        let exchangedAmount = 0;

        if(formAmount && !isNaN(Number(formAmount))) {
            exchangedAmount = numberToFractionDigit(Number(formAmount) * Number(formExchangeRate ?? 1));
        }

        return `${ exchangedAmount }${ "\u00A0" }${ defaultCurrencyText }`; // "\u00A0" - for prevent only currency wrap to the next line
    }, [formAmount, formExchangeRate, defaultCurrency, getCurrencyText]);

    const getTotalAmountTextByPricePerUnit = useCallback(() => {
        let quantity = quantityFieldName ? 0 : 1;
        if(formQuantity && !isNaN(Number(formQuantity))) quantity = Number(formQuantity);

        const defaultCurrencyText = getCurrencyText(defaultCurrency?.toString());
        const currencyText = getCurrencyText(formCurrency?.toString());

        let amount = 0;
        let exchangedAmount = 0;

        if(formAmount && !isNaN(Number(formAmount)) && !isNaN(Number(formAmount))) {
            amount = Number(formAmount);
            exchangedAmount = amount * Number(formExchangeRate ?? 1);
        }

        return (
            <PricePerUnitTotalCostInCarCurrency
                amountText={ `${ quantity * amount } ${ currencyText }` }
                carAmountText={ defaultCurrency !== formCurrency && `${ quantity * exchangedAmount } ${ defaultCurrencyText }` }
            />
        );
    }, [formAmount, formQuantity, formExchangeRate, formCurrency, defaultCurrency, getCurrencyText]);

    return (
        <View style={ styles.container }>
            <Input.Title title={ title ?? t("currency.cost") } subtitle={ subtitle }/>
            {
                (
                    !isPricePerUnitFieldName &&
                    isPricePerUnitFallback &&
                    (!isNaN(Number(formQuantity)) && Number(formQuantity) > 1)
                ) &&
               <Text style={ styles.label }>
                   { getTotalAmountTextByPricePerUnit() }
               </Text>
            }
            {
                isPricePerUnitFieldName &&
               <Input.Field control={ control } fieldName={ isPricePerUnitFieldName }>
                  <View style={ styles.isPricePerUnitContainer }>
                     <Input.Switch label={ { on: t("currency.price_per_unit"), off: t("currency.total_cost") } }/>
                      {
                          formIsPricePerUnit &&
                         <View style={ styles.isPricePerUnitContainer.textContainer }>
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
                    (showsQuantityInput && quantityFieldName) &&
                   <View style={ styles.quantityContainer }>
                      <Input.Row style={ { gap: 0 } }>
                         <View style={ { flex: 1 } }>
                            <Input.Field
                               control={ control }
                               fieldName={ quantityFieldName }
                            >
                               <Input.Text
                                  placeholder={ "1" }
                                  keyboardType="numeric"
                                  type="secondary"
                               />
                            </Input.Field>
                         </View>
                         <Text style={ styles.quantityContainer.countText }>{ t("common.count") }</Text>
                      </Input.Row>
                   </View>
                }
                <Input.Row style={ { gap: 0 } }>
                    <View style={ styles.amountContainer }>
                        <View style={ styles.amountContainer.amount }>
                            <Input.Field
                                control={ control }
                                fieldName={ amountFieldName }
                            >
                                <Input.Text
                                    icon={ ICON_NAMES.money }
                                    placeholder={ amountPlaceholder ?? t("currency.cost") }
                                    keyboardType="numeric"
                                    type="secondary"
                                />
                            </Input.Field>
                        </View>
                        <Input.Field control={ control } fieldName={ currencyFieldName }>
                            {
                                currencies
                                ?
                                <Input.Picker.Dropdown
                                    data={ currencies }
                                    title={ t("currency.text") }
                                    hiddenBackground={ true }
                                />
                                :
                                <MoreDataLoading/>
                            }
                        </Input.Field>
                    </View>
                </Input.Row>
            </View>
            {
                showsExchangeRate && exchangeRateFieldName && (formCurrency?.toString() !== defaultCurrency?.toString()) &&
               <View style={ styles.exchangeContainer }>
                  <View style={ styles.exchangeContainer.textContainer }>
                     <Text style={ styles.label }>
                        <AmountInCarCurrency amountText={ getExchangedAmount() } isPricePerUnit={ formIsPricePerUnit }/>
                     </Text>
                  </View>
                  <View style={ styles.exchangeContainer.inputContainer }>
                     <Input.Row style={ styles.exchangeContainer.inputContainer.row }>
                        <View style={ styles.exchangeContainer.inputContainer.label }>
                           <Text style={ styles.exchangeContainer.inputContainer.label.baseText }>1</Text>
                           <Text
                              style={ styles.exchangeContainer.inputContainer.label.currencyText }>
                               { getCurrencyText(formCurrency?.toString()) }
                           </Text>
                           <Text style={ styles.exchangeContainer.inputContainer.label.arrow }>⇄</Text>
                        </View>
                        <Input.Field
                           control={ control }
                           fieldName={ exchangeRateFieldName }
                           style={ { flex: 1 } }
                        >
                           <Input.Text
                              placeholder="1.0"
                              keyboardType="numeric"
                              type="secondary"
                           />
                        </Input.Field>
                        <Text style={ styles.exchangeContainer.inputContainer.label.currencyText }>
                            { getCurrencyText(defaultCurrency?.toString()) }
                        </Text>
                     </Input.Row>
                  </View>
               </View>
            }
        </View>
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
        gap: SEPARATOR_SIZES.lightSmall,

        textContainer: {
            flexShrink: 1,
            height: "100%"
        }
    },
    quantityAmountContainer: {
        flexDirection: "row",
        gap: SEPARATOR_SIZES.lightSmall
    },
    quantityContainer: {
        flex: 0.4,

        countText: {
            alignSelf: "flex-end",
            marginBottom: SEPARATOR_SIZES.small,
            fontSize: formTheme.valueTextFontSize / 1.35,
            color: COLORS.gray1
        }
    },
    amountContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: SEPARATOR_SIZES.lightSmall / 2,

        amount: {
            flex: 1
        }
    },
    label: {
        fontFamily: "Gilroy-Medium",
        fontSize: FONT_SIZES.p3,
        color: COLORS.gray1
    },
    exchangeContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: SEPARATOR_SIZES.lightSmall,

        textContainer: {
            flex: 1
        },

        inputContainer: {
            flex: 0.55,

            row: {
                flex: 0,
                alignItems: "center",
                gap: 0
            },

            label: {
                flexDirection: "row",
                alignItems: "center",

                baseText: {
                    fontSize: formTheme.valueTextFontSize,
                    color: formTheme.valueTextColor,
                    marginRight: 2
                },

                arrow: {
                    fontSize: formTheme.valueTextFontSize,
                    color: COLORS.gray1,
                    fontWeight: 600,
                    marginLeft: 2,
                    marginBottom: formTheme.valueTextFontSize / 4
                },

                currencyText: {
                    fontSize: formTheme.valueTextFontSize / 1.35,
                    color: COLORS.gray1
                }
            }
        }
    }
});