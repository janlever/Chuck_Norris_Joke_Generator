import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "https://api.chucknorris.io/jokes";

export const fetchRandomJoke = createAsyncThunk(
  "jokes/fetchRandomJoke",
  async () => {
    const response = await axios.get(`${API_BASE}/random`);
    return response.data;
  }
);

export const fetchJokeByCategory = createAsyncThunk(
  "jokes/fetchJokeByCategory",
  async (category) => {
    const response = await axios.get(`${API_BASE}/random?category=${category}`);
    return response.data;
  }
);

export const fetchCategories = createAsyncThunk(
  "jokes/fetchCategories",
  async () => {
    const response = await axios.get(`${API_BASE}/categories`);
    return response.data;
  }
);

const jokeSlice = createSlice({
  name: "jokes",
  initialState: {
    currentJoke: null,
    savedJokes: [],
    categories: [],
    loading: false,
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
        state.loading = true;
      })
      .addCase(fetchRandomJoke.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJoke = action.payload;
      })
      .addCase(fetchRandomJoke.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchJokeByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJokeByCategory.fulfilled, (state, action) => {
        state.loading = true;
        state.currentJoke = action.payload;
      })
      .addCase(fetchJokeByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { saveJoke, deleteJoke, editJoke } = jokeSlice.actions;

export default jokeSlice.reducer;
