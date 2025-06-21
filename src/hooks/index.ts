import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../features/Database/redux/store.ts";
import { RootState } from "../features/Database/redux";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();