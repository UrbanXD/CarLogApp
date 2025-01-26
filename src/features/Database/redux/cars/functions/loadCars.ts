import { createAsyncThunk } from "@reduxjs/toolkit";
import { encode } from "base64-arraybuffer";
import { Database } from "../../../connector/Database";
import { CarDAO } from "../../../DAOs/CarDAO";

export const loadCars = createAsyncThunk(
    "cars",
    async (database: Database, { rejectWithValue }) => {
        try {
            const {
                db,
                attachmentQueue
            } = database;

            const carDAO = new CarDAO(db);
            const cars = await carDAO.getCars();

            const images: Array<{path: string, image:  string}> = [];
            const processedCars = await Promise.all(
                cars.map(async (car) => {
                    let image = undefined;
                    if (car.image && attachmentQueue) {
                        const file = await attachmentQueue.getFile(car.image);
                        image = file ? encode(file) : undefined;
                    }
                    if (car.image && image) {
                        images.push({
                            path: car.image,
                            image,
                        });
                    }
                    return car;
                })
            );

            return { cars: processedCars, images };
        } catch (e) {
            console.log(e);
            return rejectWithValue("");
        }
    }
);