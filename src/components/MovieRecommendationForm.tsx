import { useState } from 'react';

interface MovieRecommendationFormProps {
  onSubmit: (data: any) => void;
  loading: boolean;
}

const MovieRecommendationForm: React.FC<MovieRecommendationFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    genre: '',
    runtime: 'medium',
    age: '',
    topN: '5',
    minRating: '8.0',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      age: parseInt(formData.age),
      topN: parseInt(formData.topN),
      minRating: parseFloat(formData.minRating),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
            Genre Preferences (comma-separated)
          </label>
          <input
            type="text"
            id="genre"
            name="genre"
            required
            placeholder="e.g., Drama, Action, Comedy"
            value={formData.genre}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="runtime" className="block text-sm font-medium text-gray-700">
            Runtime Preference
          </label>
          <select
            id="runtime"
            name="runtime"
            value={formData.runtime}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">
            Your Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            required
            min="1"
            max="120"
            value={formData.age}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="topN" className="block text-sm font-medium text-gray-700">
            Number of Recommendations
          </label>
          <input
            type="number"
            id="topN"
            name="topN"
            min="1"
            max="20"
            value={formData.topN}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="minRating" className="block text-sm font-medium text-gray-700">
            Minimum Rating
          </label>
          <input
            type="number"
            id="minRating"
            name="minRating"
            min="0"
            max="10"
            step="0.1"
            value={formData.minRating}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Getting Recommendations...' : 'Get Recommendations'}
        </button>
      </div>
    </form>
  );
};

export default MovieRecommendationForm; 