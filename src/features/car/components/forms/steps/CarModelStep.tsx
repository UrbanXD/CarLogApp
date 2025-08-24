import React, { useEffect, useMemo, useState } from "react";
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
import { getToday } from "../../../../../utils/getDate.ts";

const CarModelStep: React.FC<StepProps> = ({
    control,
    resetField
}) => {
    const { db, carDAO } = useDatabase();

    const selectedBrandId = useWatch({
        control,
        name: "brandId"
    });

    const selectedModelId = useWatch({
        control,
        name: "modelId"
    });

    const [modelYears, setModelYears] = useState<Array<string>>([]);

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
    ), [db]);

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
        const fetchYears = async () => {
            const model = await carDAO.getCarModelById(selectedModelId);

            if(!model) return;
            const years = {
                start: Number(model.startYear),
                end: !model?.endYear
                     ? getToday().getFullYear()
                     : Number(model.endYear)
            };

            const result = Array.from(
                { length: years.end - years.start + 1 },
                (_, key) => (years.start + key).toString()
            ).reverse();

            setModelYears(result);
        };

        fetchYears();
    }, [selectedModelId]);

    useEffect(() => {
        if(resetField) resetField("modelId", { keepError: true, keepDirty: true });
    }, [selectedBrandId]);

    useEffect(() => {
        if(resetField) resetField("modelYear", { keepError: true, keepDirty: true });
    }, [selectedModelId]);

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
                <Input.Picker.Dropdown<CarModelTableType>
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
            <Input.Field
                control={ control }
                fieldName="modelYear"
                fieldNameText="Évjárat"
            >
                <Input.Picker.Dropdown<string>
                    data={ modelYears }
                    dataTransformSelectors={ {} }
                    searchBarEnable={ false }
                    masonry
                    numColumns={ 3 }
                    icon={ ICON_NAMES.calendar }
                    disabled={ !selectedModelId }
                    disabledText="Először válassza ki az autó modelljét!"
                />
            </Input.Field>
        </Input.Group>
    );
};

export default CarModelStep;