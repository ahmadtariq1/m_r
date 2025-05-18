import joblib
import json
import sys

def recommend_movies(genre_preference, runtime_pref, age, top_n=5, min_rating=8.0):
    """
    Recommend movies based on genre preference, runtime preference, and age
    """
    try:
        # Load the model
        model = joblib.load('movie_recommender.joblib')
        tfidf = model['tfidf']
        cosine_sim = model['cosine_sim']
        movies = model['movies']
        
        # Determine age rating based on user's age
        if age < 10:
            age_rating = 'all'
        elif 10 <= age < 13:
            age_rating = '10+'
        elif 13 <= age < 17:
            age_rating = '13+'
        else:
            age_rating = '17+'
        
        # Clean genre input
        cleaned_genre = ' '.join([g.strip().lower() for g in genre_preference.split(',')])
        
        # Create query string
        query = f"{cleaned_genre} {runtime_pref.lower()} {age_rating}"
        
        # Vectorize the query
        query_vec = tfidf.transform([query])
        
        # Compute similarity between query and all movies
        sim_scores = cosine_similarity(query_vec, tfidf.transform(model['features'])).flatten()
        
        # Filter movies by minimum rating and age appropriateness
        valid_movies = movies[
            (movies['rating'] >= min_rating) & 
            (movies['age_rating'] <= age_rating)
        ].copy()
        valid_movies['similarity'] = sim_scores[valid_movies.index]
        
        # Get top N most similar movies
        recommendations = valid_movies.sort_values(
            by=['similarity', 'rating'], 
            ascending=[False, False]
        ).head(top_n)
        
        # Convert to list of dictionaries
        result = recommendations[['name', 'year', 'genre', 'rating', 'runtime_category', 'tagline']].to_dict('records')
        return json.dumps({"success": True, "recommendations": result})
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)})

if __name__ == "__main__":
    # Get arguments from command line
    genre_preference = sys.argv[1]
    runtime_pref = sys.argv[2]
    age = int(sys.argv[3])
    top_n = int(sys.argv[4]) if len(sys.argv) > 4 else 5
    min_rating = float(sys.argv[5]) if len(sys.argv) > 5 else 8.0
    
    # Print the result
    print(recommend_movies(genre_preference, runtime_pref, age, top_n, min_rating)) 