const express = require("express");
const app = express();
const PORT = 1337;

app.use(express.json());

let movies = [
  { id: 1641812427583, name: "The Matrix", year: 1998, rating: "9/10" },
  { id: 1641812427483, name: "Ironman", year: 2008, rating: "8/10" },
];

// 0. get one movie
app.get("/api/movies/:id", (req, res) => {
  const movie = movies.find((m) => m.id == req.params.id);
  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  return res.json({ ...movie });
});

// 1. get all movies
app.get("/api/movies", (req, res) => {
  res.json(movies);
});

// 2. add a movie
app.post("/api/movies", (req, res) => {
  const payload = req.body;
  if (!payload.name || !payload.year || !payload.rating) {
    return res.status(400).json({ message: "Bad request" });
  }
  const movie = {
    id: new Date().getTime(),
    ...payload,
  };
  movies.push(movie);
  res.status(201).json(movie);
});

// 3. remove a movie
app.delete("/api/movies/:id", (req, res, next) => {
  const movie = movies.find((m) => m.id == req.params.id);
  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const filtered = movies.filter((m) => m.id != req.params.id);
  movies = filtered;
  res.status(200).json({ ...movie });
});

// 4. update a movie
app.put("/api/movies/:id", (req, res, next) => {
  const payload = req.body;
  if (!payload.name || !payload.year || !payload.rating) {
    return res.status(400).json({ message: "Bad request" });
  }

  const movieIndex = movies.findIndex((m) => m.id == req.params.id);
  if (movieIndex == -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  movies[movieIndex]["name"] = payload.name;
  movies[movieIndex]["year"] = payload.year;
  movies[movieIndex]["rating"] = payload.rating;

  res.status(200).json({ ...movies[movieIndex] });
});

// error handlers
app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server running on port ${PORT}`);
});
