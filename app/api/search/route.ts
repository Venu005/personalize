import { NextRequest, NextResponse } from "next/server";

const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const NEWSAPI_BASE_URL = process.env.NEWSAPI_BASE_URL || 'https://newsapi.org/v2';
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

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
    const query = searchParams.get('q');
    const type = searchParams.get('type');

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const results: any[] = [];

    // Search news if type is 'news' or 'all' or not specified
    if ((!type || type === 'all' || type === 'news') && NEWSAPI_KEY && NEWSAPI_KEY !== 'your_actual_newsapi_key_here') {
      try {
        const newsParams = new URLSearchParams({
          apiKey: NEWSAPI_KEY,
          q: query,
          language: 'en',
          sortBy: 'relevancy',
          pageSize: '5',
        });

        const newsResponse = await fetchWithRetry(`${NEWSAPI_BASE_URL}/everything?${newsParams.toString()}`, {
          headers: { 'User-Agent': 'PersonalDashboard/1.0' },
          next: { revalidate: 300 },
        });

        if (newsResponse.ok) {
          const newsData = await newsResponse.json();
          const newsResults = newsData.articles?.slice(0, 5).map((article: any, index: number) => ({
            id: `news-search-${Date.now()}-${index}`,
            type: 'news',
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.urlToImage,
            source: article.source,
            publishedAt: article.publishedAt,
          })) || [];
          results.push(...newsResults);
        }
      } catch (error) {
        console.error('News search error:', error);
      }
    }

    // Search movies if type is 'movie' or 'all' or not specified
    if ((!type || type === 'all' || type === 'movie') && TMDB_API_KEY && TMDB_API_KEY !== 'your_actual_tmdb_api_key_here') {
      try {
        const movieParams = new URLSearchParams({
          api_key: TMDB_API_KEY,
          query: query,
          language: 'en-US',
          page: '1',
          include_adult: 'false',
        });

        const movieResponse = await fetchWithRetry(`${TMDB_BASE_URL}/search/movie?${movieParams.toString()}`, {
          headers: { 'Accept': 'application/json', 'User-Agent': 'PersonalDashboard/1.0' },
          next: { revalidate: 3600 },
        });

        if (movieResponse.ok) {
          const movieData = await movieResponse.json();
          const movieResults = movieData.results?.slice(0, 5).map((movie: any) => ({
            id: `movie-search-${movie.id}`,
            type: 'movie',
            title: movie.title,
            overview: movie.overview,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
          })) || [];
          results.push(...movieResults);
        }
      } catch (error) {
        console.error('Movie search error:', error);
      }
    }

    // Add mock social results (since we don't have a real social API)
    if (!type || type === 'all' || type === 'social') {
      const socialResults = [
        {
          id: `social-search-${Date.now()}`,
          type: 'social',
          content: `Just found some amazing content about "${query}"! This is exactly what I was looking for 🔥 #${query.replace(/\s+/g, '')}`,
          author: 'ContentExplorer',
          hashtags: [query.replace(/\s+/g, ''), 'discovery', 'trending'],
          likes: Math.floor(Math.random() * 500) + 50,
          timestamp: new Date().toISOString(),
        }
      ];
      results.push(...socialResults);
    }

    // If no API keys are configured, return helpful mock results
    if (results.length === 0) {
      const mockResults = [
        {
          id: `mock-search-${Date.now()}`,
          type: 'news',
          title: `Search results for "${query}" - API Configuration Required`,
          description: 'To see real search results, please configure your NewsAPI and TMDB API keys in the .env.local file.',
          url: '#',
          urlToImage: 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
          source: { name: 'Configuration Notice' },
          publishedAt: new Date().toISOString(),
        }
      ];
      results.push(...mockResults);
    }

    // Shuffle results for variety
    const shuffledResults = results.sort(() => Math.random() - 0.5);

    return NextResponse.json(shuffledResults.slice(0, 10));
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}