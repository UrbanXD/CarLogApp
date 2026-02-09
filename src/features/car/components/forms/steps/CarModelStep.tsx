import React, { useEffect, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import Input from "../../../../../components/Input/Input.ts";
import { StepProps } from "../../../../../types";
import { ICON_NAMES } from "../../../../../constants";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { CarFormFields } from "../../../schemas/form/carForm.ts";
import { YearPicker } from "../../../../../components/Input/_presets/YearPicker.tsx";
import { useTranslation } from "react-i18next";

type CarModelStepProps = Pick<StepProps<CarFormFields>, "control" | "formState" | "setValue">;

function CarModelStep({
    control,
    formState,
    setValue
}: CarModelStepProps) {
    const { t } = useTranslation();
    const { makeDao, modelDao } = useDatabase();

    const selectedMakeId = useWatch({ control, name: "model.makeId" });
    const selectedModelId = useWatch({ control, name: "model.id" });
    const selectedYear = useWatch({ control, name: "model.year" });
    const [modelYears, setModelYears] = useState<{ start?: number, end?: number }>({});

    const [defaultLoadMakeId, setDefaultLoadMakeId] = useState(true);
    const [defaultLoadModelId, setDefaultLoadModelId] = useState(true);

    const makeQueryOptions = useMemo(() => makeDao.pickerInfiniteQuery(), []);
    const modelQueryOptions = useMemo(() => modelDao.pickerInfiniteQuery(selectedMakeId ?? null), [selectedMakeId]);

    useEffect(() => {
        if(defaultLoadModelId) setDefaultLoadModelId(false);
        if(!selectedModelId) return;

        const fetchYears = async () => setModelYears((await modelDao.getModelYearsById(selectedModelId)));
        fetchYears();
    }, [selectedModelId]);

    useEffect(() => {
        if(defaultLoadMakeId) return setDefaultLoadMakeId(false);
        if(formState.defaultValues?.["model"]?.["makeId"] === selectedMakeId && formState.defaultValues?.["model"]?.["id"] === selectedModelId) return;

        setValue("model.id", "");
    }, [selectedMakeId]);

    useEffect(() => {
        let ignore = false;
        const fetchYears = async () => {
            const years = await modelDao.getModelYearsById(selectedModelId);
            if(!ignore) setModelYears(years);
        };
        if(selectedModelId) fetchYears();
        return () => { ignore = true; };
    }, [selectedModelId]);

    useEffect(() => {
        let ignore = false;

        const setHiddenInputsValue = async () => {
            const model = await modelDao.getById(selectedModelId);
            const make = model ? await makeDao.getById(model.makeId) : null;

            if(ignore) return;

            setValue("model.name", model?.name ?? "");
            setValue("model.makeName", make?.name ?? "");
        };

        if(ignore) return;
        if(selectedModelId) setHiddenInputsValue();
        if(defaultLoadModelId) return setDefaultLoadModelId(false);
        if(formState.defaultValues?.["model"]?.["id"] === selectedModelId && formState.defaultValues?.["model"]?.["year"] === selectedYear) return;
        setValue("model.year", "");

        return () => {
            ignore = true;
        };
    }, [selectedModelId]);

    return (
        <Input.Group>
            <Input.Field
                control={ control }
                fieldName="model.makeId"
                fieldNameText={ t("car.steps.model.make_field.title") }
            >
                <Input.Picker.Dropdown<typeof makeQueryOptions["baseQuery"]>
                    title={ t("car.steps.model.make_field.title") }
                    queryOptions={ makeQueryOptions }
                    searchBy="name"
                    icon={ ICON_NAMES.car }
                />
            </Input.Field>
            <Input.Field
                control={ control }
                fieldName="model.id"
                fieldNameText={ t("car.steps.model.model_field.title") }
            >
                <Input.Picker.Dropdown<typeof modelQueryOptions["baseQuery"]>
                    key={ `model-picker-${ selectedMakeId }` }
                    title={ t("car.steps.model.model_field.title") }
                    queryOptions={ modelQueryOptions }
                    searchBy="name"
                    icon={ ICON_NAMES.car }
                    disabled={ !selectedMakeId }
                    disabledText={ t("car.steps.model.model_field.disabled_text") }
                />
            </Input.Field>
            <Input.Field
                control={ control }
                fieldName="model.year"
                fieldNameText={ t("car.steps.model.model_year_field.title") }
            >
                <YearPicker
                    key={ `model-year-picker-${ selectedMakeId }-${ selectedModelId }` }
                    title={ t("car.steps.model.model_year_field.title") }
                    icon={ ICON_NAMES.calendar }
                    maxYear={ modelYears.end ?? new Date().getFullYear() }
                    minYear={ modelYears.start }
                    disabled={ !selectedModelId }
                    disabledText={ t("car.steps.model.model_year_field.disabled_text") }
                />
            </Input.Field>
        </Input.Group>
    );
}

export default CarModelStep;