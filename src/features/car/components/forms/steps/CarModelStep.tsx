import React, { useEffect, useMemo } from "react";
import { useWatch } from "react-hook-form";
import Input from "../../../../../components/Input/Input.ts";
import { StepProps } from "../../../../../types/index.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import {
    CAR_BRAND_TABLE,
    CAR_MODEL_TABLE,
    CarBrandTableType,
    CarModelTableType
} from "../../../../../database/connector/powersync/AppSchema.ts";
import { PaginatorFactory, PaginatorType } from "../../../../../database/paginator/PaginatorFactory.ts";
import { ToPickerItemsSelectors } from "../../../../../utils/toPickerItems.ts";

const CarModelStep: React.FC<StepProps> = ({
    control,
    resetField
}) => {
    const { db } = useDatabase();

    const selectedBrandId = useWatch({
        control,
        name: "brandId"
    });

    const brandsPaginator = useMemo(() => PaginatorFactory.createPaginator<CarBrandTableType>(
        PaginatorType.cursor,
        db,
        CAR_BRAND_TABLE,
        "id",
        {
            perPage: 50,
            orderBy: { field: "name", direction: "asc", toLowerCase: true },
            searchBy: "name"
        },
        "name"
    ), []);

    const modelsPaginator = useMemo(() => {
        console.log("modalsPaginator useMemo");
        return PaginatorFactory.createPaginator<CarModelTableType>(
            PaginatorType.cursor,
            db,
            CAR_MODEL_TABLE,
            "id",
            {
                perPage: 25,
                filterBy: selectedBrandId ? { field: "brand", value: selectedBrandId, operator: "=" } : undefined,
                orderBy: { field: "name", direction: "asc", toLowerCase: true },
                searchBy: "name"
            },
            "name"
        );
    }, [db, selectedBrandId]);

    useEffect(() => {
        if(resetField) resetField("modelId", { keepError: true, keepDirty: true });
    }, [selectedBrandId]);

    return (
        <Input.Group>
            <Input.Field
                control={ control }
                fieldName="brandId"
                fieldNameText="Márka"
            >
                <Input.Picker.Dropdown<CarBrandTableType>
                    paginator={ brandsPaginator }
                    icon={ ICON_NAMES.car }
                    dataTransformSelectors={ {
                        title: "name",
                        value: "id"
                    } as ToPickerItemsSelectors<CarBrandTableType> }
                />
            </Input.Field>
            <Input.Field
                control={ control }
                fieldName="modelId"
                fieldNameText="Modell"
            >
                <Input.Picker.Dropdown
                    paginator={ modelsPaginator }
                    icon={ ICON_NAMES.car }
                    dataTransformSelectors={ {
                        title: "name",
                        value: "id"
                    } as ToPickerItemsSelectors<CarModelTableType> }
                    disabled={ !selectedBrandId }
                    disabledText="Először válassza ki az autó márkáját!"
                />
            </Input.Field>
        </Input.Group>
    );
};

export default CarModelStep;