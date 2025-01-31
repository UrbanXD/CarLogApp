import { RootState } from "../features/Database/redux/store";
import { useSelector } from "react-redux";

const useCars = () => {
    const selectCarsState = (state: RootState) => state.cars.cars;
    const selectCarsImageState = (state: RootState) => state.cars.carsImage;
    const loadingState = (state: RootState) => state.cars.loading;
    const isLoading = useSelector(loadingState);

    const cars = useSelector(selectCarsState);
    const carsImage = useSelector(selectCarsImageState);

    const getCar = (id: string) =>
        cars.find(car => car.id === id) || cars[0];

    const getCarImage = (id: string) =>
        carsImage.find(image => image.path === getCar(id)?.image);

    return {
        cars,
        carsImage,
        isLoading,
        getCar,
        getCarImage
    }
}

export default useCars;