import { configureStore } from "@reduxjs/toolkit";
import jokeReducer from "./features/jokes/jokeSlice";

const store = configureStore({
  reducer: {
    jokes: jokeReducer,
  },
});

export default store;
