import { ExpenseTableRow } from "../../../database/connector/powersync/AppSchema.ts";
import { FilterButtonProps } from "../../../components/filter/FilterButton.tsx";
import { GetOrderIconForField, IsMainCursor, MakeFieldMainCursor, ToggleFieldOrder } from "../../../hooks/useCursor.ts";

type UseExpenseTimelineCursorOptions = {
    isMainCursor: IsMainCursor<keyof ExpenseTableRow>
    makeFieldMainCursor: MakeFieldMainCursor<keyof ExpenseTableRow>
    toggleFieldOrder: ToggleFieldOrder<keyof ExpenseTableRow>
    getOrderIconForField: GetOrderIconForField<keyof ExpenseTableRow>
}

export function useExpenseTimelineCursorOptions({
    isMainCursor,
    makeFieldMainCursor,
    toggleFieldOrder,
    getOrderIconForField
}: UseExpenseTimelineCursorOptions) {
    const orderButtons: Array<FilterButtonProps> = [
        {
            title: "Dátum",
            active: isMainCursor("date"),
            onPress: () => makeFieldMainCursor("date"),
            icon: getOrderIconForField("date"),
            iconOnPress: () => toggleFieldOrder("date")
        },
        {
            title: "Ár",
            active: isMainCursor("amount"),
            onPress: () => makeFieldMainCursor("amount"),
            icon: getOrderIconForField("amount"),
            iconOnPress: () => toggleFieldOrder("amount")
        }
    ];

    return { orderButtons };
}