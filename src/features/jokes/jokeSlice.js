import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchRandomJoke = createAsyncThunk(
  "jokes/fetchRandomJoke",
  async () => {
    const response = await axios.get("https://api.chucknorris.io/jokes/random");
    return response.data;
  }
);

export const fetchJokeByCategory = createAsyncThunk(
  "jokes/fetchJokeByCategory",
  async (category) => {
    const response = await axios.get(
      `https://api.chucknorris.io/jokes/random?category=${category}`
    );
    return response.data;
  }
);

export const fetchCategories = createAsyncThunk(
  "jokes/fetchCategories",
  async () => {
    const response = await axios.get(
      "https://api.chucknorris.io/jokes/categories"
    );
    return response.data;
  }
);

const jokeSlice = createSlice({
  name: "jokes",
  initialState: {
    currentJoke: null,
    savedJokes: [],
    categories: [],
    loading: "idle",
    error: null,
  },
  reducers: {
    saveJoke(state, action) {
      if (!state.savedJokes.find((joke) => joke.id === action.payload.id)) {
        state.savedJokes.push(action.payload);
      }
    },
    deleteJoke(state, action) {
      state.savedJokes = state.savedJokes.filter(
        (joke) => joke.id !== action.payload
      );
    },
    editJoke(state, action) {
      const { id, value } = action.payload;
      const joke = state.savedJokes.find((joke) => joke.id === id);
      if (joke) {
        joke.value = value;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRandomJoke.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchRandomJoke.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.currentJoke = action.payload;
      })
      .addCase(fetchRandomJoke.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchJokeByCategory.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchJokeByCategory.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.currentJoke = action.payload;
      })
      .addCase(fetchJokeByCategory.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { saveJoke, deleteJoke, editJoke } = jokeSlice.actions;

export default jokeSlice.reducer;
