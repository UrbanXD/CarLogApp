import BottomSheet from "../../../../../../ui/bottomSheet/components/BottomSheet.tsx";
import React from "react";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { EditServiceLogForm } from "../../components/forms/EditServiceLogForm.tsx";
import { ServiceLog } from "../../schemas/serviceLogSchema.ts";
import { ServiceLogFormFieldsEnum } from "../../enums/ServiceLogFormFieldsEnum.ts";

type EditServiceLogBottomSheetProps = {
    serviceLog: ServiceLog,
    field: ServiceLogFormFieldsEnum
}

export function EditServiceLogBottomSheet({ serviceLog, field }: EditServiceLogBottomSheetProps) {
    const CONTENT = <EditServiceLogForm serviceLog={ serviceLog } field={ field }/>;
    const MAX_DYNAMIC_CONTENT_SIZE = heightPercentageToDP(85);

    return (
        <BottomSheet
            content={ CONTENT }
            maxDynamicContentSize={ MAX_DYNAMIC_CONTENT_SIZE }
            enableDynamicSizing
            enableDismissOnClose={ false }
            enableOverDrag={ false }
        />
    );
}