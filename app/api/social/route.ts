import { NextRequest, NextResponse } from "next/server";

// Mock social media data
const mockSocialPosts = [
  {
    id: '1',
    content: 'Just discovered an amazing new AI tool that completely changed my workflow! The future is here 🚀 #AI #productivity #tech',
    author: 'TechEnthusiast',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    likes: 342,
    hashtags: ['AI', 'productivity', 'tech']
  },
  {
    id: '2',
    content: 'Working on a new React project and loving the new hooks patterns. The developer experience keeps getting better! 💻',
    author: 'CodeMaster',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    likes: 156,
    hashtags: ['React', 'coding', 'webdev']
  },
  {
    id: '3',
    content: 'The latest movie releases are incredible! Just watched an amazing sci-fi thriller that blew my mind 🎬 #movies #cinema',
    author: 'MovieBuff',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes: 89,
    hashtags: ['movies', 'cinema', 'scifi']
  },
  {
    id: '4',
    content: 'Climate action is more important than ever. Every small step counts towards a sustainable future 🌍 #climate #sustainability',
    author: 'EcoWarrior',
    avatar: 'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    likes: 234,
    hashtags: ['climate', 'sustainability', 'environment']
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hashtag = searchParams.get('hashtag');

  let filteredPosts = mockSocialPosts;

  if (hashtag) {
    filteredPosts = filteredPosts.filter(post => 
      post.hashtags.some(tag => tag.toLowerCase().includes(hashtag.toLowerCase()))
    );
  }

  return NextResponse.json(filteredPosts);
}