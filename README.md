# Movie Recommender System

A web application that recommends movies based on user preferences using machine learning.

## Features

- Genre-based movie recommendations
- Runtime preference filtering
- Age-appropriate content filtering
- Customizable number of recommendations
- Minimum rating threshold

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd movies-recommender
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Install Node.js dependencies:
```bash
npm install
# or
yarn install
```

4. Place your trained model file:
- Put your `movie_recommender.joblib` file in the root directory

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is ready to be deployed on Vercel:

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Deploy!

## Project Structure

```
movies-recommender/
├── api/
│   └── recommend.py      # Python script for movie recommendations
├── src/
│   ├── app/
│   │   ├── page.tsx     # Main page component
│   │   └── api/         # API routes
│   └── components/      # React components
├── public/             # Static files
├── movie_recommender.joblib  # Trained ML model
└── requirements.txt    # Python dependencies
```

## Environment Variables

No environment variables are required for this project.

## License

MIT 