import { combineReducers } from "@reduxjs/toolkit";

import { baseApi } from "./api";

export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
});
