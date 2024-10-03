import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRandomJoke,
  fetchJokeByCategory,
  fetchCategories,
  saveJoke,
  deleteJoke,
  editJoke,
} from "./jokeSlice";
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, selectedCategories, theme) {
  return {
    fontWeight: selectedCategories.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

const JokesPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { currentJoke, savedJokes, categories, loading, error } = useSelector(
    (state) => state.jokes
  );
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [editingJokeId, setEditingJokeId] = useState(null);
  const [editedJokeText, setEditedJokeText] = useState("");
  const [fetchedJokeIds, setFetchedJokeIds] = useState(new Set());
  const [duplicateMessage, setDuplicateMessage] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
    fetchUniqueJoke();
  }, [dispatch]);

  const fetchUniqueJoke = useCallback(async () => {
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
  }, [dispatch, fetchedJokeIds]);

  const handleSaveJoke = useCallback(() => {
    if (currentJoke) {
      const jokeExists = savedJokes.some((joke) => joke.id === currentJoke.id);
      if (jokeExists) {
        setDuplicateMessage("This joke is already saved!");
      } else {
        dispatch(saveJoke(currentJoke));
        setDuplicateMessage("");
      }
    }
  }, [currentJoke, savedJokes, dispatch]);

  const handleDeleteJoke = useCallback(
    (id) => {
      dispatch(deleteJoke(id));
    },
    [dispatch]
  );

  const handleEditJoke = useCallback(
    (id, value) => {
      dispatch(editJoke({ id, value }));
      setEditingJokeId(null);
    },
    [dispatch]
  );

  const handleEditButtonClick = useCallback((joke) => {
    setEditingJokeId(joke.id);
    setEditedJokeText(joke.value);
  }, []);

  const handleCategoryChange = useCallback((event) => {
    const {
      target: { value },
    } = event;
    setSelectedCategories(typeof value === "string" ? value.split(",") : value);
  }, []);

  const fetchUniqueJokeByCategory = useCallback(
    async (category) => {
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
    },
    [dispatch, fetchedJokeIds]
  );

  const handleGetJoke = useCallback(() => {
    setDuplicateMessage("");
    if (selectedCategories.length > 0) {
      fetchUniqueJokeByCategory(selectedCategories[0]);
    } else {
      fetchUniqueJoke();
    }
  }, [selectedCategories, fetchUniqueJokeByCategory, fetchUniqueJoke]);

  if (loading === "pending") {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Press the button below to get a random Chuck Norris joke:
      </Typography>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button
          size="large"
          variant="contained"
          color="primary"
          onClick={handleGetJoke}
        >
          Get Random Joke
        </Button>
        <FormControl sx={{ m: 1, width: 250 }}>
          <InputLabel id="category-select-label">Select Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            multiple
            value={selectedCategories}
            onChange={handleCategoryChange}
            input={<OutlinedInput label="Select Category" />}
            MenuProps={MenuProps}
          >
            {categories.map((category) => (
              <MenuItem
                key={category}
                value={category}
                style={getStyles(category, selectedCategories, theme)}
              >
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {currentJoke && (
        <>
          <Typography variant="body1" gutterBottom>
            {currentJoke.value}
          </Typography>
          <Button variant="outlined" onClick={handleSaveJoke}>
            Save Joke
          </Button>
          {duplicateMessage && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {duplicateMessage}
            </Typography>
          )}
        </>
      )}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Saved Jokes
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Joke</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {savedJokes.map((joke) => (
              <TableRow key={joke.id}>
                <TableCell>{joke.id}</TableCell>
                <TableCell>
                  {editingJokeId === joke.id ? (
                    <TextField
                      id="outlined-multiline-flexible"
                      label="Edit Joke"
                      multiline
                      value={editedJokeText}
                      onChange={(e) => setEditedJokeText(e.target.value)}
                      fullWidth
                    />
                  ) : (
                    joke.value
                  )}
                </TableCell>
                <TableCell>
                  {editingJokeId === joke.id ? (
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={() => handleEditJoke(joke.id, editedJokeText)}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditButtonClick(joke)}
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteJoke(joke.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default JokesPage;
