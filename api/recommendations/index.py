from http.server import BaseHTTPRequestHandler
import json
import joblib
from sklearn.metrics.pairwise import cosine_similarity

def recommend_movies(genre_preference, runtime_pref, age, top_n=5, min_rating=8.0):
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
        return {"success": True, "recommendations": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)
        
        genre = data.get('genre', '')
        runtime = data.get('runtime', '')
        age = data.get('age', 0)
        top_n = data.get('topN', 5)
        min_rating = data.get('minRating', 8.0)
        
        result = recommend_movies(genre, runtime, age, top_n, min_rating)
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(result).encode()) 