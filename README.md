# Personalized Dashboard

A modern, responsive dashboard that aggregates content from multiple sources including news, movies, and social media.

## Features

- **Real-time News**: Powered by NewsAPI
- **Movie Database**: Integrated with TMDB (The Movie Database)
- **Social Feed**: Mock social media content
- **Personalized Feed**: Customizable content based on user preferences
- **Favorites System**: Save and organize your favorite content
- **Trending Content**: Discover what's popular across all categories
- **Search Functionality**: Search across all content types
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes
- **Drag & Drop**: Reorder your personalized feed

## Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd personalized-dashboard
```

### 2. Install dependencies
```bash
npm install
```

### 3. Get API Keys (REQUIRED)

⚠️ **Important**: This application requires valid API keys to function properly. The example keys in `.env.local` will not work and must be replaced.

#### NewsAPI
1. Go to [NewsAPI.org](https://newsapi.org/)
2. Sign up for a free account (no credit card required)
3. Verify your email address
4. Go to your dashboard and copy your API key
5. **Free tier limitations**: 100 requests per day, developer use only

#### TMDB API
1. Go to [TMDB](https://www.themoviedb.org/)
2. Create an account and verify your email
3. Go to Settings > API in your account
4. Click "Request an API Key"
5. Choose "Developer" option
6. Fill out the application form:
   - Application Name: "Personal Dashboard" (or any name)
   - Application URL: "http://localhost:3000" (for development)
   - Application Summary: "Personal content dashboard for learning/development"
7. Accept the terms and submit
8. Copy your API key (v3 auth)

### 4. Environment Variables

**CRITICAL**: Replace the example API keys in `.env.local` with your actual keys:

```env
# Replace these with your actual API keys
NEWSAPI_KEY=your_actual_newsapi_key_from_newsapi_org
TMDB_API_KEY=your_actual_tmdb_api_key_from_themoviedb_org

# These URLs are correct and don't need to be changed
NEWSAPI_BASE_URL=https://newsapi.org/v2
TMDB_BASE_URL=https://api.themoviedb.org/3
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Troubleshooting

### API Key Errors
If you see 401 errors in the console:
1. Double-check that your API keys are correctly copied (no extra spaces or characters)
2. Verify your NewsAPI account is verified via email
3. Ensure your TMDB API key request was approved
4. Restart the development server after updating `.env.local`

### Rate Limiting
- **NewsAPI Free Tier**: 100 requests/day
- **TMDB**: 1,000 requests per day
- If you hit limits, the app will show cached content or error messages

### Development Environment Issues
If you encounter runtime errors or connection issues:
1. Ensure you have a stable internet connection
2. Use Node.js LTS version (18.x or 20.x recommended)
3. Clear browser cache and restart the dev server
4. Check that no firewall is blocking API requests

## API Endpoints

### News API (`/api/news`)
- **GET** `/api/news` - Get latest news
- **Query Parameters**:
  - `category` - News category (business, entertainment, general, health, science, sports, technology)
  - `q` - Search query
  - `country` - Country code (default: 'us')
  - `pageSize` - Number of articles (default: 20)

### Movies API (`/api/movies`)
- **GET** `/api/movies` - Get movies
- **Query Parameters**:
  - `genre` - Movie genre (action, comedy, drama, horror, sci-fi, etc.)
  - `q` - Search query
  - `page` - Page number (default: 1)

### Search API (`/api/search`)
- **GET** `/api/search` - Search across all content
- **Query Parameters**:
  - `q` - Search query (required)
  - `type` - Content type filter (news, movie, social, or all)

## Tech Stack

- **Framework**: Next.js 13 with App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Redux Toolkit + RTK Query
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Drag & Drop**: react-beautiful-dnd

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── favorites/         # Favorites page
│   ├── trending/          # Trending page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── cards/            # Content cards
│   ├── dialogs/          # Modal dialogs
│   ├── feed/             # Feed components
│   ├── layout/           # Layout components
│   ├── sections/         # Page sections
│   ├── skeletons/        # Loading skeletons
│   └── ui/               # shadcn/ui components
├── store/                # Redux store
│   ├── slices/           # Redux slices
│   └── api.ts            # RTK Query API
└── lib/                  # Utilities
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details