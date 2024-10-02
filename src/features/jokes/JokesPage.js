import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRandomJoke,
  fetchJokeByCategory,
  fetchCategories,
  saveJoke,
  deleteJoke,
  editJoke,
} from "./jokeSlice";

const JokesPage = () => {
  const dispatch = useDispatch();
  const { currentJoke, savedJokes, categories, loading, error } = useSelector(
    (state) => state.jokes
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingJokeId, setEditingJokeId] = useState(null);
  const [editedJokeText, setEditedJokeText] = useState("");
  const [fetchedJokeIds, setFetchedJokeIds] = useState(new Set());

  useEffect(() => {
    dispatch(fetchCategories());
    fetchUniqueJoke();
  }, [dispatch]);

  const fetchUniqueJoke = async () => {
    let jokeFetched = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!jokeFetched && attempts < maxAttempts) {
      const result = await dispatch(fetchRandomJoke()).unwrap();
      if (!fetchedJokeIds.has(result.id)) {
        setFetchedJokeIds((prevIds) => new Set(prevIds).add(result.id));
        jokeFetched = true;
      }
      attempts++;
    }

    if (!jokeFetched) {
      alert("No more unique jokes available.");
    }
  };

  const handleSaveJoke = () => {
    if (currentJoke) {
      dispatch(saveJoke(currentJoke));
    }
  };

  const handleDeleteJoke = (id) => {
    dispatch(deleteJoke(id));
  };

  const handleEditJoke = (id, value) => {
    dispatch(editJoke({ id, value }));
    setEditingJokeId(null);
  };

  const handleEditButtonClick = (joke) => {
    setEditingJokeId(joke.id);
    setEditedJokeText(joke.value);
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    if (category) {
      fetchUniqueJokeByCategory(category);
    } else {
      fetchUniqueJoke();
    }
  };

  const fetchUniqueJokeByCategory = async (category) => {
    let jokeFetched = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!jokeFetched && attempts < maxAttempts) {
      const result = await dispatch(fetchJokeByCategory(category)).unwrap();
      if (!fetchedJokeIds.has(result.id)) {
        setFetchedJokeIds((prevIds) => new Set(prevIds).add(result.id));
        jokeFetched = true;
      }
      attempts++;
    }

    if (!jokeFetched) {
      alert("No more unique jokes available in this category.");
    }
  };

  const handleGetJoke = () => {
    if (selectedCategory) {
      fetchUniqueJokeByCategory(selectedCategory);
    } else {
      fetchUniqueJoke();
    }
  };

  if (loading === "pending") {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Press the button below to get a random Chuck Norris joke:</h1>
      <button onClick={handleGetJoke}>Get Random Joke</button>
      <select value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      {currentJoke && (
        <>
          <p>{currentJoke.value}</p>
          <button onClick={handleSaveJoke}>Save Joke</button>
        </>
      )}
      <h2>Saved Jokes</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Joke</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {savedJokes.map((joke) => (
            <tr key={joke.id}>
              <td>{joke.id}</td>
              <td>
                {editingJokeId === joke.id ? (
                  <input
                    type="text"
                    value={editedJokeText}
                    onChange={(e) => setEditedJokeText(e.target.value)}
                  />
                ) : (
                  joke.value
                )}
              </td>
              <td>
                {editingJokeId === joke.id ? (
                  <button
                    onClick={() => handleEditJoke(joke.id, editedJokeText)}
                  >
                    Save
                  </button>
                ) : (
                  <button onClick={() => handleEditButtonClick(joke)}>
                    Edit
                  </button>
                )}
                <button onClick={() => handleDeleteJoke(joke.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JokesPage;
