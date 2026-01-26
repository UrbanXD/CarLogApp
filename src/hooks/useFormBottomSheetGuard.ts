import { useEffect } from "react";
import { useAlert } from "../ui/alert/hooks/useAlert.ts";
import { NotFoundToast } from "../ui/alert/presets/toast";
import { router } from "expo-router";

type UseScreenGuardProps<T> = {
    data: any
    isLoading: boolean
    field?: string | undefined
    isFieldNullable?: boolean
    enumObject?: T
    notFoundText: string
};

export function useFormBottomSheetGuard<T extends object>({
    data,
    isLoading,
    field,
    isFieldNullable,
    enumObject,
    notFoundText
}: UseScreenGuardProps<T>) {
    const { openToast } = useAlert();

    const rawValue = field !== undefined && !isNaN(Number(field))
                     ? Number(field)
                     : field;

    const shouldCheckField = (!isFieldNullable && field !== undefined) && enumObject !== undefined;

    const isValidField = rawValue && shouldCheckField
                         ? Object.values(enumObject).includes(rawValue as any) || rawValue in enumObject
                         : true;

    console.log((isValidField ? rawValue : undefined));

    useEffect(() => {
        if(isLoading) return;

        if(shouldCheckField && !isValidField) {
            console.error("ScreenGuard: Invalid field value:", rawValue);
            handleNavigation();
            return;
        }

        if(!data) {
            openToast(NotFoundToast.warning(notFoundText));
            handleNavigation();
        }
    }, [data, isLoading, isValidField, shouldCheckField, notFoundText]);

    const handleNavigation = () => {
        if(router.canGoBack()) return router.back();
        router.replace("(main)/index");
    };

    return {
        fieldValue: (isValidField ? rawValue : undefined) as unknown as T[keyof T],
        isValidField
    };
}