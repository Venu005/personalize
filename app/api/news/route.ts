import { NextRequest, NextResponse } from "next/server";

const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const NEWSAPI_BASE_URL = process.env.NEWSAPI_BASE_URL || 'https://newsapi.org/v2';

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
    const category = searchParams.get('category') || 'general';
    const query = searchParams.get('q');
    const country = searchParams.get('country') || 'us';
    const pageSize = searchParams.get('pageSize') || '20';
    const page = searchParams.get('page') || '1'; // Add page parameter

    if (!NEWSAPI_KEY || NEWSAPI_KEY === 'your_actual_newsapi_key_here') {
      console.error('NewsAPI key not configured properly');
      
      // Return mock data when API key is not configured
      const mockArticles = [
        {
          id: `mock-news-1`,
          title: 'API Key Required - Please Configure NewsAPI',
          description: 'To see real news articles, please add your NewsAPI key to the .env.local file. Visit https://newsapi.org to get a free API key.',
          url: 'https://newsapi.org',
          urlToImage: 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
          publishedAt: new Date().toISOString(),
          source: {
            name: 'Configuration Notice',
          },
          category: category,
          author: 'System',
          content: 'Please configure your NewsAPI key to see real news content.',
        },
        {
          id: `mock-news-2`,
          title: 'Sample News Article',
          description: 'This is a sample news article that appears when the API key is not configured.',
          url: '#',
          urlToImage: 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: {
            name: 'Sample Source',
          },
          category: category,
          author: 'Sample Author',
          content: 'This is sample content for demonstration purposes.',
        }
      ];
      
      return NextResponse.json(mockArticles);
    }

    let url: string;
    const params = new URLSearchParams({
      apiKey: NEWSAPI_KEY,
      pageSize,
      sortBy: 'publishedAt',
    });

    if (query) {
      // Use everything endpoint for search
      url = `${NEWSAPI_BASE_URL}/everything`;
      params.append('q', query);
      params.append('language', 'en');
      params.append('sortBy', 'relevancy');
      params.append('page', page); // Add page parameter
    } else {
      // Use top-headlines for category browsing
      url = `${NEWSAPI_BASE_URL}/top-headlines`;
      params.append('country', country);
      params.append('page', page); // Add page parameter
      if (category !== 'general') {
        params.append('category', category);
      }
    }

    // Use the retry mechanism for fetch
    const response = await fetchWithRetry(`${url}?${params.toString()}`, {
      headers: {
        'User-Agent': 'PersonalDashboard/1.0',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('NewsAPI error:', response.status, errorData);
      
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch news' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Transform the data to match our interface
    const transformedArticles = data.articles?.map((article: any, index: number) => {
      // Create a stable ID based on the article URL or title
      const stableId = article.url 
        ? `news-${encodeURIComponent(article.url.split('://')[1]?.replace(/\//g, '-').substring(0, 50) || `article-${index}`)}`
        : `news-${encodeURIComponent(article.title?.replace(/\s+/g, '-').substring(0, 50) || `article-${index}`)}`;
      
      return {
        id: stableId,
        title: article.title || 'Untitled',
        description: article.description || '',
        url: article.url || '',
        urlToImage: article.urlToImage || 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
        publishedAt: article.publishedAt || new Date().toISOString(),
        source: {
          name: article.source?.name || 'Unknown Source',
        },
        category: category,
        author: article.author,
        content: article.content,
      };
    }) || [];

    return NextResponse.json(transformedArticles);
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}