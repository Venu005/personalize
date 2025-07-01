import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

// Genre mapping for TMDB
const GENRE_MAP: { [key: string]: number } = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  'sci-fi': 878,
  'science-fiction': 878,
  thriller: 53,
  war: 10752,
  western: 37,
};

// Helper function to retry fetch requests
async function fetchWithRetry(url: string, options: RequestInit, retries = 3, delay = 500) {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (retries <= 1) throw error;
    
    // Wait for the specified delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Retry with one less retry attempt and increased delay (exponential backoff)
    return fetchWithRetry(url, options, retries - 1, delay * 2);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre');
    const query = searchParams.get('q');
    const page = searchParams.get('page') || '1';

    if (!TMDB_API_KEY || TMDB_API_KEY === 'your_actual_tmdb_api_key_here') {
      console.error('TMDB API key not configured properly');
      
      // Return mock data when API key is not configured
      const mockMovies = [
        {
          id: 1,
          title: 'API Key Required - Please Configure TMDB',
          overview: 'To see real movie data, please add your TMDB API key to the .env.local file. Visit https://www.themoviedb.org/settings/api to get a free API key.',
          poster_path: null,
          backdrop_path: null,
          release_date: new Date().toISOString().split('T')[0],
          vote_average: 0,
          vote_count: 0,
          genre_ids: [],
          adult: false,
          original_language: 'en',
          popularity: 0,
        },
        {
          id: 2,
          title: 'Sample Movie',
          overview: 'This is a sample movie that appears when the TMDB API key is not configured.',
          poster_path: null,
          backdrop_path: null,
          release_date: '2024-01-01',
          vote_average: 7.5,
          vote_count: 100,
          genre_ids: [28, 35],
          adult: false,
          original_language: 'en',
          popularity: 50.0,
        }
      ];
      
      return NextResponse.json(mockMovies);
    }

    let url: string;
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      page,
      language: 'en-US',
    });

    if (query) {
      // Search for movies
      url = `${TMDB_BASE_URL}/search/movie`;
      params.append('query', query);
      params.append('include_adult', 'false');
    } else if (genre && GENRE_MAP[genre.toLowerCase()]) {
      // Discover movies by genre
      url = `${TMDB_BASE_URL}/discover/movie`;
      params.append('with_genres', GENRE_MAP[genre.toLowerCase()].toString());
      params.append('sort_by', 'popularity.desc');
      params.append('include_adult', 'false');
      params.append('include_video', 'false');
    } else {
      // Get popular movies
      url = `${TMDB_BASE_URL}/movie/popular`;
    }

    // Use the retry mechanism for fetch
    const response = await fetchWithRetry(`${url}?${params.toString()}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PersonalDashboard/1.0',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('TMDB API error:', response.status, errorData);
      
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch movies' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Transform the data to match our interface
    const transformedMovies = data.results?.map((movie: any) => ({
      id: movie.id,
      title: movie.title || movie.original_title || 'Untitled',
      overview: movie.overview || 'No overview available.',
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      release_date: movie.release_date || '',
      vote_average: movie.vote_average || 0,
      vote_count: movie.vote_count || 0,
      genre_ids: movie.genre_ids || [],
      adult: movie.adult || false,
      original_language: movie.original_language || 'en',
      popularity: movie.popularity || 0,
    })) || [];

    return NextResponse.json(transformedMovies);
  } catch (error) {
    console.error('TMDB API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}