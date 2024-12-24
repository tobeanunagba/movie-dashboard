import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import Tailwind styles

const API_KEY = '74ec535f';

// SearchBar Component
const SearchBar = ({ searchValue, setSearchValue, onSearch }) => {
  return (
    <div className="flex flex-col items-center mb-6">
      <input
        type="text"
        placeholder="Search for movies..."
        className="p-2 rounded border text-black border-gray-300 w-80 mb-2"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <button
        onClick={onSearch}
        className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
};

// MovieCard Component
const MovieCard = ({ movie }) => {
  return (
    <div className="bg-gray-800 text-black rounded shadow-lg p-4 w-60">
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}
        alt={movie.Title}
        className="rounded mb-4"
      />
      <h3 className="text-lg font-bold mb-2">{movie.Title}</h3>
      <p className="text-sm">Year: {movie.Year}</p>
    </div>
  );
};

// MovieDetails Component
const MovieDetails = ({ movie }) => {
  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{movie.Title}</h2>
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300'}
        alt={movie.Title}
        className="rounded mb-4"
      />
      <p><strong>Plot:</strong> {movie.Plot}</p>
      <p><strong>Director:</strong> {movie.Director}</p>
      <p><strong>Actors:</strong> {movie.Actors}</p>
      <p><strong>Genre:</strong> {movie.Genre}</p>
      <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>
      <p><strong>Released:</strong> {movie.Released}</p>
    </div>
  );
};

// Main App Component
const App = () => {
  const [searchValue, setSearchValue] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMovies = async () => {
    if (!searchValue.trim()) {
      setError('Please enter a movie name.');
      return;
    }

    setLoading(true);
    setError('');
    setSelectedMovie(null);

    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?s=${searchValue}&apikey=${API_KEY}`
      );

      if (response.data.Response === 'True') {
        setMovies(response.data.Search);
      } else {
        setError(response.data.Error);
        setMovies([]);
      }
    } catch (err) {
      setError('An error occurred while fetching movies.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieDetails = async (movieId) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?i=${movieId}&apikey=${API_KEY}`
      );

      if (response.data.Response === 'True') {
        setSelectedMovie(response.data);
      } else {
        setError(response.data.Error);
      }
    } catch (err) {
      setError('An error occurred while fetching movie details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-center text-4xl font-bold mb-8">Movie Database</h1>

      {/* Search Bar */}
      <SearchBar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onSearch={fetchMovies}
      />

      {/* Loading and Error Messages */}
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Movie List */}
      {!loading && !selectedMovie && movies.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {movies.map((movie) => (
            <div key={movie.imdbID} onClick={() => fetchMovieDetails(movie.imdbID)} className="cursor-pointer">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}

      {/* Movie Details */}
      {!loading && selectedMovie && <MovieDetails movie={selectedMovie} />}
    </div>
  );
};

export default App;
