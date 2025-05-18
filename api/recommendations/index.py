from http.server import BaseHTTPRequestHandler
import json
import os

def load_movies():
    current_dir = os.path.dirname(os.path.realpath(__file__))
    with open(os.path.join(current_dir, 'movies.json'), 'r') as f:
        return json.load(f)['movies']

def recommend_movies(genre_preference, runtime_pref, age, top_n=5, min_rating=8.0):
    try:
        # Load movies
        movies = load_movies()
        
        # Determine age rating based on user's age
        if age < 10:
            age_rating = 'all'
        elif 10 <= age < 13:
            age_rating = '10+'
        elif 13 <= age < 17:
            age_rating = '13+'
        else:
            age_rating = '17+'
        
        # Filter movies based on criteria
        filtered_movies = []
        genre_terms = [g.strip().lower() for g in genre_preference.split(',')]
        
        for movie in movies:
            # Check runtime preference
            if movie['runtime_category'].lower() != runtime_pref.lower():
                continue
                
            # Check rating threshold
            if movie['rating'] < min_rating:
                continue
                
            # Check age appropriateness
            if not (movie['age_rating'] == 'all' or 
                   (age_rating == '10+' and movie['age_rating'] in ['all', '10+']) or
                   (age_rating == '13+' and movie['age_rating'] in ['all', '10+', '13+']) or
                   age_rating == '17+'):
                continue
                
            # Check genre match
            movie_genres = [g.strip().lower() for g in movie['genre'].split(',')]
            if any(genre in movie_genres for genre in genre_terms):
                filtered_movies.append(movie)
        
        # Sort by rating and return top N
        filtered_movies.sort(key=lambda x: x['rating'], reverse=True)
        recommendations = filtered_movies[:top_n]
        
        return {"success": True, "recommendations": recommendations}
    except Exception as e:
        return {"success": False, "error": str(e)}

def handler(event, context):
    try:
        # Parse the request body
        body = json.loads(event['body'])
        
        genre = body.get('genre', '')
        runtime = body.get('runtime', '')
        age = body.get('age', 0)
        top_n = body.get('topN', 5)
        min_rating = body.get('minRating', 8.0)
        
        result = recommend_movies(genre, runtime, age, top_n, min_rating)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'error': str(e)
            })
        } 