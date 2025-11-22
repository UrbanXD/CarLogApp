import CreateCarForm from "../../components/forms/CreateCarForm.tsx";
import React from "react";
import BottomSheet from "../../../../ui/bottomSheet/components/BottomSheet.tsx";
import { useTranslation } from "react-i18next";

const CreateCarBottomSheet: React.FC = () => {
    const { t } = useTranslation();

    const TITLE = t("car.create");
    const CONTENT = <CreateCarForm/>;
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