import React from "react";
import { EditServiceLogForm } from "../../components/forms/EditServiceLogForm.tsx";
import { ServiceLog } from "../../schemas/serviceLogSchema.ts";
import { ServiceLogFormFieldsEnum } from "../../enums/ServiceLogFormFieldsEnum.ts";
import { FormBottomSheet } from "../../../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";

type EditServiceLogBottomSheetProps = {
    serviceLog: ServiceLog,
    field: ServiceLogFormFieldsEnum
}

export function EditServiceLogBottomSheet({ serviceLog, field }: EditServiceLogBottomSheetProps) {
    return (
        <FormBottomSheet
            content={ <EditServiceLogForm serviceLog={ serviceLog } field={ field }/> }
            enableDynamicSizing
        />
    );
}