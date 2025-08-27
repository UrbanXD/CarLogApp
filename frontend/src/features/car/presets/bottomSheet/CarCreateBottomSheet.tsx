import NewCarForm from "../../components/forms/NewCarForm.tsx";
import React from "react";
import BottomSheet from "../../../../ui/bottomSheet/components/BottomSheet.tsx";

const CreateCarBottomSheet: React.FC = () => {
    const TITLE = "Autó létrehozás";
    const CONTENT = <NewCarForm/>;
    const SNAP_POINTS = ["90%"];

    return (
        <BottomSheet
            title={ TITLE }
            content={ CONTENT }
            snapPoints={ SNAP_POINTS }
            enableDismissOnClose={ false }
            enableDynamicSizing={ false }
            enableOverDrag={ false }
        />
    );
};

export default CreateCarBottomSheet;