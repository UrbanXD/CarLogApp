import NewCarForm from "../../components/forms/NewCarForm.tsx";
import React from "react";
import { OpenBottomSheetArgs } from "../../../../ui/bottomSheet/types/index.ts";

export const CarCreateBottomSheet: OpenBottomSheetArgs = {
    title: "Új Autó",
    content: <NewCarForm/>,
    snapPoints: ["85%"],
    enableOverDrag: false,
    enableDismissOnClose: false
};