import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

type CarModel = {
    model: string;
    startYear: string;
    endYear: string;
};

type CarsCollection = {
    [key: string]: CarModel[];
};

const carsApiSlices = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: "https://fuelmonitorapi.onrender.com" }),
    tagTypes: ["CarAPI"],
    endpoints: (builder) => ({
        getCars: builder.query<CarsCollection, void>({
            query: () => "/cars",
            providesTags: ["CarAPI"]
        })
    })
})

export const { useGetCarsQuery } = carsApiSlices;
export default carsApiSlices;