import { useAppSelector } from "../../../hooks";
import { getSelectedCarId } from "../model/selectors/getSelectedCarId.ts";

export function useSelectedCarId() {
    const selectedCarId = useAppSelector(getSelectedCarId);

    return { selectedCarId };
}