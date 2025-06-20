import { OpenBottomSheetArgs } from "../../../../ui/bottomSheet/contexts/BottomSheetContext.ts";
import NewCarForm from "../../components/forms/NewCarForm.tsx";
import React from "react";

export const CarCreateBottomSheet: OpenBottomSheetArgs = {
    title: "Új Autó",
    content: <NewCarForm/>,
    snapPoints: ["85%"],
    enableOverDrag: false,
    enableDismissOnClose: false
};