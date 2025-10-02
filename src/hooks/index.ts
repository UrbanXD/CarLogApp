import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../database/redux/store.ts";
import { RootState } from "../database/redux/index.ts";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();