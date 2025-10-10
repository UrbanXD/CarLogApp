import Input from "../../../../components/Input/Input.ts";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZES, ICON_NAMES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { MoreDataLoading } from "../../../../components/loading/MoreDataLoading.tsx";
import React, { useCallback, useEffect, useState } from "react";
import { Control, useWatch } from "react-hook-form";
import { PickerItemType } from "../../../../components/Input/picker/PickerItem.tsx";
import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { formTheme } from "../../../..//ui/form/constants/theme.ts";

type AmountInputProps = {
    control: Control<any>
    title?: string
    subtitle?: string
    amountPlaceholder?: string
    amountFieldName: string
    currencyFieldName: string
    exchangeRateFieldName?: string
    exchangeText?: (exchangedAmount: string) => string
    showsExchangeRate?: boolean
    resetExchangeRate?: () => void
    defaultCurrency?: string | number
}

export function AmountInput({
    control,
    title = "Összeg",
    subtitle,
    amountPlaceholder = "Összeg",
    amountFieldName,
    currencyFieldName,
    exchangeRateFieldName,
    exchangeText,
    showsExchangeRate = !!exchangeRateFieldName,
    resetExchangeRate,
    defaultCurrency
}: AmountInputProps) {
    const { currencyDao } = useDatabase();

    const [currencies, setCurrencies] = useState<Array<PickerItemType> | null>(null);

    const formCurrency = useWatch({ control, name: currencyFieldName });
    const formAmount = useWatch({ control, name: amountFieldName });
    const formExchangeRate = exchangeRateFieldName ? useWatch({ control, name: exchangeRateFieldName }) : null;

    useEffect(() => {
        (async () => {
            const currenciesDto = await currencyDao.getAll();
            setCurrencies(currencyDao.mapper.dtoToPicker(currenciesDto));
        })();
    }, []);

    useEffect(() => {
        if(formCurrency.toString() === defaultCurrency?.toString()) resetExchangeRate();
    }, [formCurrency]);

    const getCurrencyText = useCallback((currencyId: string) => {
        const currency = currencies?.find((currency: PickerItemType) => currency.value === currencyId);

        return currency?.controllerTitle ?? currency?.title ?? "";
    }, [currencies]);

    const getExchangedAmount = useCallback(() => {
        const defaultCurrencyText = getCurrencyText(defaultCurrency?.toString());

        let exchangedAmount = 0;

        if(formAmount && !isNaN(Number(formAmount))) {
            exchangedAmount = (Number(formAmount) * Number(formExchangeRate ?? 1)).toFixed(2).replace(/[.,]00$/, "");
        }

        return `${ exchangedAmount } ${ defaultCurrencyText }`;
    }, [formAmount, formExchangeRate, defaultCurrency, getCurrencyText]);

    return (
        <View style={ styles.container }>
            <Input.Title title={ title } subtitle={ subtitle }/>
            <Input.Row style={ { gap: 0 } }>
                <View style={ styles.amountContainer }>
                    <View style={ styles.amountContainer.amount }>
                        <Input.Field
                            control={ control }
                            fieldName={ amountFieldName }
                        >
                            <Input.Text
                                icon={ ICON_NAMES.money }
                                placeholder={ amountPlaceholder }
                                numeric
                                type={ "secondary" }
                            />
                        </Input.Field>
                    </View>
                    <Input.Field control={ control } fieldName={ currencyFieldName }>
                        {
                            currencies
                            ?
                            <Input.Picker.Dropdown
                                data={ currencies }
                                title={ "Valuta" }
                                type={ "secondary" }
                                hiddenBackground={ true }
                            />
                            :
                            <MoreDataLoading/>
                        }
                    </Input.Field>
                </View>
            </Input.Row>
            {
                showsExchangeRate && exchangeRateFieldName && (formCurrency.toString() !== defaultCurrency?.toString()) &&
               <View style={ styles.exchangeContainer }>
                  <View style={ styles.exchangeContainer.textContainer }>
                     <Text style={ styles.exchangeContainer.textContainer.text }>
                         {
                             exchangeText &&
                             exchangeText(getExchangedAmount())
                         }
                     </Text>
                  </View>
                  <View style={ styles.exchangeContainer.inputContainer }>
                     <Input.Field
                        control={ control }
                        fieldName={ exchangeRateFieldName }
                     >
                        <Input.Row style={ styles.exchangeContainer.inputContainer.row }>
                           <View style={ styles.exchangeContainer.inputContainer.label }>
                              <Text style={ styles.exchangeContainer.inputContainer.label.baseText }>1</Text>
                              <Text
                                 style={ styles.exchangeContainer.inputContainer.label.currencyText }>
                                  { getCurrencyText(formCurrency.toString()) }
                              </Text>
                              <Text style={ styles.exchangeContainer.inputContainer.label.arrow }>⇄</Text>
                           </View>
                           <Input.Text
                              placeholder="1.0"
                              numeric
                              containerStyle={ { flexGrow: 1 } }
                              type="secondary"
                           />
                           <Text style={ styles.exchangeContainer.inputContainer.label.currencyText }>
                               { getCurrencyText(defaultCurrency?.toString()) }
                           </Text>
                        </Input.Row>
                     </Input.Field>
                  </View>
               </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: SEPARATOR_SIZES.lightSmall
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
    exchangeContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: SEPARATOR_SIZES.lightSmall,

        textContainer: {
            flex: 0.60,

            text: {
                fontFamily: "Gilroy-Medium", fontSize: FONT_SIZES.p3,
                color: COLORS.gray1
            }
        },

        inputContainer: {
            flex: 0.40,

            row: {
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