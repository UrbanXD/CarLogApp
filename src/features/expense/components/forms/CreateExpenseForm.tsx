import useCars from "../../../car/hooks/useCars.ts";
import React, { useEffect, useState } from "react";
import { Car } from "../../../car/schemas/carSchema.ts";
import { useForm, useWatch } from "react-hook-form";
import Button from "../../../../components/Button/Button.ts";
import { ExpenseFields, useCreateExpenseFormProps } from "../../schemas/form/expenseForm.ts";
import { useCreateExpense } from "../../hooks/useCreateExpense.ts";
import { ExpenseFormView } from "./ExpenseFormView.tsx";

export function CreateExpenseForm() {
    const { selectedCar, getCar } = useCars();

    const [car, setCar] = useState<Car | null>(selectedCar);

    const form = useForm<ExpenseFields>(useCreateExpenseFormProps(car));
    const { control, handleSubmit, clearErrors } = form;
    const { submitHandler } = useCreateExpense(handleSubmit);

    const formCarId = useWatch({ control, name: "carId" });

    useEffect(() => {
        const car = getCar(formCarId);
        setCar(car ?? null);
        clearErrors();
    }, [formCarId]);

    return (
        <>
            <ExpenseFormView { ...form } car={ car }/>
            <Button.Text
                text={ "Rögizítés" }
                onPress={ submitHandler }
                style={ { width: "70%", alignSelf: "flex-end" } }
            />
        </>
    );
}