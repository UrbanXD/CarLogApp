import React, { useEffect, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import Input from "../../../../../components/Input/Input.ts";
import { StepProps } from "../../../../../types/index.ts";
import { ICON_NAMES } from "../../../../../constants/index.ts";
import { useDatabase } from "../../../../../contexts/database/DatabaseContext.ts";
import { MakeTableRow, ModelTableRow } from "../../../../../database/connector/powersync/AppSchema.ts";
import { CarFormFields } from "../../../schemas/form/carForm.ts";
import { YearPicker } from "../../../../../components/Input/_presets/YearPicker.tsx";
import { useTranslation } from "react-i18next";

type CarModelStepProps<FormFields> = Pick<StepProps<FormFields>, "control" | "formState" | "setValue">;

function CarModelStep<FormFields = CarFormFields>({ control, formState, setValue }: CarModelStepProps<FormFields>) {
    const { t } = useTranslation();
    const { makeDao, modelDao } = useDatabase();

    const selectedMakeId = useWatch({ control, name: "model.makeId" });
    const selectedModelId = useWatch({ control, name: "model.id" });
    const selectedYear = useWatch({ control, name: "model.year" });
    const [modelYears, setModelYears] = useState<Array<string>>([]);

    const [defaultLoadMakeId, setDefaultLoadMakeId] = useState(true);
    const [defaultLoadModelId, setDefaultLoadModelId] = useState(true);

    const makePaginator = useMemo(() => makeDao.paginator(50), []);
    const modelPaginator = useMemo(() => modelDao.paginatorByMakeId(selectedMakeId, 25), [selectedMakeId]);

    useEffect(() => {
        if(defaultLoadModelId) setDefaultLoadModelId(false);
        if(!selectedModelId) return;

        const fetchYears = async () => setModelYears(await modelDao.getModelYearsById(selectedModelId, true));
        fetchYears();
    }, [selectedModelId]);

    useEffect(() => {
        if(defaultLoadMakeId) return setDefaultLoadMakeId(false);
        if(formState.defaultValues?.["model"]?.["makeId"] === selectedMakeId && formState.defaultValues?.["model"]?.["id"] === selectedModelId) return;

        setValue("model.id", "", { keepError: true, keepDirty: true });
    }, [selectedMakeId]);

    useEffect(() => {
        const setHiddenInputsValue = async () => {
            const model = await modelDao.getById(selectedModelId);
            const make = await makeDao.getById(model.makeId);

            setValue("model.name", model.name);
            setValue("model.makeName", make.name);
        };

        if(selectedModelId) setHiddenInputsValue();
        if(defaultLoadModelId) return setDefaultLoadModelId(false);
        if(formState.defaultValues?.["model"]?.["id"] === selectedModelId && formState.defaultValues?.["model"]?.["year"] === selectedYear) return;
        setValue("model.year", "", { keepError: true, keepDirty: true });
    }, [selectedModelId]);

    return (
        <Input.Group>
            <Input.Field
                control={ control }
                fieldName="model.makeId"
                fieldNameText={ t("car.steps.model.make_field.title") }
            >
                <Input.Picker.Dropdown<MakeTableRow>
                    title={ t("car.steps.model.make_field.title") }
                    paginator={ makePaginator }
                    searchBy="name"
                    icon={ ICON_NAMES.car }
                />
            </Input.Field>
            <Input.Field
                control={ control }
                fieldName="model.id"
                fieldNameText={ t("car.steps.model.model_field.title") }
            >
                <Input.Picker.Dropdown<ModelTableRow>
                    title={ t("car.steps.model.model_field.title") }
                    paginator={ modelPaginator }
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
                    title={ t("car.steps.model.model_year_field.title") }
                    icon={ ICON_NAMES.calendar }
                    data={ modelYears }
                    disabled={ !selectedModelId }
                    disabledText={ t("car.steps.model.model_year_field.disabled_text") }
                />
            </Input.Field>
        </Input.Group>
    );
}

export default CarModelStep;