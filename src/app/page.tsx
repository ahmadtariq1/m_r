'use client';

import { useState } from 'react';
import MovieRecommendationForm from '@/components/MovieRecommendationForm';
import MovieList from '@/components/MovieList';

export default function Home() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetRecommendations = async (formData: any) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setRecommendations(data.recommendations);
      } else {
        setError(data.error || 'Failed to get recommendations');
      }
    } catch (err) {
      setError('An error occurred while fetching recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-primary mb-8">
          Movie Recommendations
        </h1>
        
        <MovieRecommendationForm onSubmit={handleGetRecommendations} loading={loading} />
        
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {recommendations.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-secondary mb-4">
              Your Recommendations
            </h2>
            <MovieList movies={recommendations} />
          </div>
        )}
      </div>
    </main>
  );
} 