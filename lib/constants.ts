// Static lists of all possible categories to ensure consistent hook calls
export const NEWS_CATEGORIES = [
  'general',
  'business',
  'entertainment',
  'health',
  'science',
  'sports',
  'technology'
] as const;

export const MOVIE_GENRES = [
  'action',
  'adventure',
  'animation',
  'comedy',
  'crime',
  'documentary',
  'drama',
  'family',
  'fantasy',
  'history',
  'horror',
  'music',
  'mystery',
  'romance',
  'science-fiction',
  'thriller',
  'war',
  'western'
] as const;

export const SOCIAL_HASHTAGS = [
  'trending',
  'news',
  'technology',
  'sports',
  'entertainment',
  'lifestyle',
  'travel',
  'food',
  'fashion',
  'fitness',
  'music',
  'art',
  'photography',
  'gaming',
  'business'
] as const;

export type NewsCategory = typeof NEWS_CATEGORIES[number];
export type MovieGenre = typeof MOVIE_GENRES[number];
export type SocialHashtag = typeof SOCIAL_HASHTAGS[number];