import { NextResponse } from 'next/server';
import movies from '../../../../api/recommendations/movies.json';

export async function POST(request: Request) {
  try {
    const { genre, runtime, age, topN = 5, minRating = 8.0 } = await request.json();

    if (!genre || !runtime || !age) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Determine age rating based on user's age
    let age_rating;
    if (age < 10) {
      age_rating = 'all';
    } else if (age < 13) {
      age_rating = '10+';
    } else if (age < 17) {
      age_rating = '13+';
    } else {
      age_rating = '17+';
    }

    // Filter movies based on criteria
    const genre_terms = genre.toLowerCase().split(',').map(g => g.trim());
    
    const filtered_movies = movies.movies.filter(movie => {
      // Check runtime preference
      if (movie.runtime_category.toLowerCase() !== runtime.toLowerCase()) {
        return false;
      }

      // Check rating threshold
      if (movie.rating < minRating) {
        return false;
      }

      // Check age appropriateness
      const isAgeAppropriate = 
        movie.age_rating === 'all' ||
        (age_rating === '10+' && ['all', '10+'].includes(movie.age_rating)) ||
        (age_rating === '13+' && ['all', '10+', '13+'].includes(movie.age_rating)) ||
        age_rating === '17+';

      if (!isAgeAppropriate) {
        return false;
      }

      // Check genre match
      const movie_genres = movie.genre.toLowerCase().split(',').map(g => g.trim());
      return genre_terms.some(genre => movie_genres.includes(genre));
    });

    // Sort by rating and get top N
    const recommendations = filtered_movies
      .sort((a, b) => b.rating - a.rating)
      .slice(0, topN);

    return NextResponse.json({ success: true, recommendations });
  } catch (error) {
    console.error('Error in recommendations API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
} 