import { supabaseAdminClient } from "../_shared/index.ts";

type Model = {
    name: string,
    years: {
        startYear: string,
        endYear?: string | null
    }
}

type Brand = {
    brand: string,
    models: Array<Model>
}

function deserializeJson<Result = any>(uint8Arr: Uint8Array<ArrayBufferLike>): Result {
    const decoder = new TextDecoder("utf-8");
    const jsonString = decoder.decode(uint8Arr);

    return JSON.parse(jsonString);
}

const jsonPath = `${ Deno.env.get("CAR_BRANDS_BUCKET") }/${ Deno.env.get("CAR_BRANDS_JSON_NAME") }`;
const jsonRaw = Deno.readFileSync(`/s3/${ jsonPath }`);
const carBrandsAndModels = deserializeJson<Array<Brand>>(jsonRaw);

const handler = async () => {
    const brandNames = carBrandsAndModels.map(b => b.brand);
    const { data, error } = await supabaseAdminClient
    .from("car_brand")
    .select("id, name");

    if(error) {
        console.error(error);
        return;
    }


    const brandMap = new Map(data.map(b => [b.name, b.id]));

    carBrandsAndModels.forEach(b => {
        const id = brandMap.get(b.brand);
        console.log(b.brand, id);

    });
};
// const initialLoadCarBrands = async () => {
//     if(await AsyncStorage.getItem(BaseConfig.LOCAL_STORAGE_KEY_CAR_BRANDS_VERSION) === BaseConfig.CAR_BRANDS_VERSION && await carDAO.areCarBrandsAndModelsExists()) return;
//
//     import("../../assets/cars.json").then(async carBrandsData => {
//         const carBrands: Array<CarBrandTableType> = [];
//         const carModels: Array<CarModelTableType> = [];
//
//         let brandId = 0;
//         let modelId = 0;
//         carBrandsData.default.map(rawBrand => {
//             if(!rawBrand?.models || rawBrand.models.length === 0) return;
//             brandId++;
//
//             const brand: CarBrandTableType = { id: brandId, name: rawBrand.brand };
//             carBrands.push(brand);
//             rawBrand.models.map(rawModel => {
//                 modelId++;
//
//                 const model: CarModelTableType = {
//                     id: modelId,
//                     brand: brand.id,
//                     name: rawModel.name,
//                     startYear: Number(rawModel.years.startYear),
//                     endYear: rawModel.years.endYear !== "" ? Number(rawModel.years.endYear) : null
//                 };
//                 carModels.push(model);
//             });
//         });
//
//         await carDAO.updateCarBrands(carBrands);
//         await carDAO.updateCarModels(carModels);
//
//         if(await carDAO.areCarBrandsAndModelsExists()) AsyncStorage.setItem(
//             BaseConfig.LOCAL_STORAGE_KEY_CAR_BRANDS_VERSION,
//             BaseConfig.CAR_BRANDS_VERSION
//         );
//     });
// };


Deno.serve(handler);