import { UseFormReturn } from "react-hook-form";
import { AmountInputProps } from "../../../../../../_shared/currency/components/AmountInput.tsx";

type ServiceItemInputProps = {
    form: UseFormReturn<any>
    title?: string
    subtitle?: string
    //serviceItemTypeInputProps: Omit<ServiceItemTypeInput, "form">
    amountInputProps: Omit<AmountInputProps, "form">
    quantityFieldName: string
}


export function ServiceItemInput({
    form,
    title,
    subtitle,
    amountInputProps,
    quantityFieldName
}: ServiceItemInputProps) {
    return (
        <></>
    );
}