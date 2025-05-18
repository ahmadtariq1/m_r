interface Movie {
  name: string;
  year: number;
  genre: string;
  rating: number;
  runtime_category: string;
  tagline: string;
}

interface MovieListProps {
  movies: Movie[];
}

const MovieList: React.FC<MovieListProps> = ({ movies }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {movies.map((movie, index) => (
        <div
          key={`${movie.name}-${index}`}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6">
            <h3 className="text-xl font-semibold text-primary mb-2">
              {movie.name} ({movie.year})
            </h3>
            <p className="text-gray-600 text-sm mb-4">{movie.tagline}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Genre:</span>
                <span className="ml-2 text-gray-600">{movie.genre}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Rating:</span>
                <span className="ml-2 text-gray-600">{movie.rating.toFixed(1)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Runtime:</span>
                <span className="ml-2 text-gray-600 capitalize">{movie.runtime_category}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieList; 