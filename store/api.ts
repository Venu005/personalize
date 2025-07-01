import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Mock API endpoints for demonstration
const mockBaseQuery = fetchBaseQuery({
  baseUrl: '/api/',
});

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  category: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface SocialPost {
  id: string;
  content: string;
  author: string;
  avatar: string;
  timestamp: string;
  likes: number;
  hashtags: string[];
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: mockBaseQuery,
  tagTypes: ['News', 'Movies', 'SocialPosts'],
  endpoints: (builder) => ({
    getNews: builder.query<NewsItem[], { category?: string; q?: string; page?: string; pageSize?: string; country?: string }>({  // Updated parameters
      query: ({ category, q, page = '1', pageSize = '20', country = 'us' }) => ({
        url: 'news',
        params: { category, q, page, pageSize, country },
      }),
      providesTags: ['News'],
    }),
    getMovies: builder.query<Movie[], { genre?: string; q?: string; page?: string }>({  // Updated parameters
      query: ({ genre, q, page = '1' }) => ({
        url: 'movies',
        params: { genre, q, page },
      }),
      providesTags: ['Movies'],
    }),
    getSocialPosts: builder.query<SocialPost[], { hashtag?: string; page?: string }>({  // Updated parameters
      query: ({ hashtag, page = '1' }) => ({
        url: 'social',
        params: { hashtag, page },
      }),
      providesTags: ['SocialPosts'],
    }),
    searchContent: builder.query<any[], { query: string; type?: string }>({
      query: ({ query, type }) => ({
        url: 'search',
        params: { q: query, type },
      }),
    }),
  }),
});

export const {
  useGetNewsQuery,
  useGetMoviesQuery,
  useGetSocialPostsQuery,
  useSearchContentQuery,
} = api;