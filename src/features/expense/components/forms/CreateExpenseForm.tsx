import { useDatabase } from "../../../../contexts/database/DatabaseContext.ts";
import { useAlert } from "../../../../ui/alert/hooks/useAlert.ts";
import { useBottomSheet } from "../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import useCars from "../../../car/hooks/useCars.ts";
import React, { useEffect, useState } from "react";
import { Car } from "../../../car/schemas/carSchema.ts";
import { useForm, useWatch } from "react-hook-form";
import { CarCreateToast } from "../../../car/presets/toast/index.ts";
import Form from "../../../../components/Form/Form.tsx";
import { ICON_NAMES, SEPARATOR_SIZES } from "../../../../constants/index.ts";
import Input from "../../../../components/Input/Input.ts";
import InputDatePicker from "../../../../components/Input/datePicker/InputDatePicker.tsx";
import Button from "../../../../components/Button/Button.ts";
import { ExpenseFields, useCreateExpenseFormProps } from "../../schemas/form/expenseForm.ts";
import { MoreDataLoading } from "../../../../components/loading/MoreDataLoading.tsx";
import { PickerItemType } from "../../../../components/Input/picker/PickerItem.tsx";
import { AmountInput } from "../../../../components/Input/_presets/AmountInput.tsx";
import { CarPickerInput } from "../../../car/components/forms/inputFields/CarPickerInput.tsx";
import { NoteInput } from "../../../../components/Input/_presets/NoteInput.tsx";

export function CreateExpenseForm() {
    const { expenseDao, currencyDao, expenseTypeDao } = useDatabase();
    const { openToast } = useAlert();
    const { dismissBottomSheet } = useBottomSheet();
    const { selectedCar, getCar } = useCars();

    const [car, setCar] = useState<Car | null>(selectedCar);
    const [expenseTypes, setExpenseTypes] = useState<Array<PickerItemType> | null>(null);

    const { control, handleSubmit, clearErrors, resetField } =
        useForm<ExpenseFields>(useCreateExpenseFormProps(car));

    const formCarId = useWatch({ control, name: "carId" });

    useEffect(() => {
        (async () => {
            const expenseTypesDto = await expenseTypeDao.getAll();
            setExpenseTypes(expenseTypeDao.mapper.dtoToPicker(expenseTypesDto));
        })();
    }, []);

    useEffect(() => {
        const car = getCar(formCarId);
        setCar(car ?? null);
        clearErrors();
    }, [formCarId]);

    const submitHandler = handleSubmit(
        async (formResult: ExpenseFields) => {
            try {
                await expenseDao.create(formResult, true);

                openToast(CarCreateToast.success());

                if(dismissBottomSheet) dismissBottomSheet(true);
            } catch(e) {
                openToast(CarCreateToast.error());
                console.error("Hiba a submitHandler-ben log:", e);
            }
        },
        (errors) => {
            console.log("Create expense validation errors", errors);
            openToast(CarCreateToast.error());
        }
    );

    return (
        <>
            <Form containerStyle={ { paddingBottom: SEPARATOR_SIZES.small } }>
                <CarPickerInput
                    control={ control }
                    fieldName="carId"
                />
                <Input.Field
                    control={ control }
                    fieldName={ "typeId" }
                    fieldNameText={ "Kiadás típus" }
                >
                    {
                        expenseTypes
                        ?
                        <Input.Picker.Dropdown
                            title={ "Kiadás típus" }
                            icon={ ICON_NAMES.nametag }
                            data={ expenseTypes }
                        />
                        :
                        <MoreDataLoading/>
                    }
                </Input.Field>
                <AmountInput
                    control={ control }
                    amountFieldName="amount"
                    currencyFieldName="currencyId"
                    exchangeRateFieldName="exchangeRate"
                    exchangeText={ (exchangedAmount) => `Az autó alapvalutájában számolt összeg: ${ exchangedAmount }` }
                    resetExchangeRate={ () => resetField("exchangeRate") }
                    defaultCurrency={ car?.currency.id }
                />
                <Input.Field
                    control={ control }
                    fieldName="date"
                    fieldNameText="Dátum"
                >
                    <InputDatePicker/>
                </Input.Field>
                <NoteInput
                    control={ control }
                    resetField={ resetField }
                    fieldName="note"
                />
            </Form>
            <Button.Text
                text={ "Rögizítés" }
                onPress={ submitHandler }
                style={ { width: "70%", alignSelf: "flex-end" } }
            />
        </>
    );
}