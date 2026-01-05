
import { Product, BlogPost, TeamMember } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Pomelo Peel Vegan Hand Wash',
    category: 'Hand Wash',
    price: 18.00,
    description: 'Enriched with natural pomelo peel extracts to cleanse gently while leaving a refreshing, citrusy scent.',
    ingredients: ['Pomelo Peel Extract', 'Aloe Vera', 'Vitamin E'],
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
    stock: 50,
    featured: true
  },
  {
    id: '2',
    name: 'Green Tea Revitalizing Soap',
    category: 'Hand Wash',
    price: 16.00,
    description: 'Antioxidant-rich green tea helps soothe and protect sensitive skin with every wash.',
    ingredients: ['Green Tea Extract', 'Glycerin', 'Shea Butter'],
    imageUrl: 'https://images.unsplash.com/photo-1600175107436-1199b44585ec?auto=format&fit=crop&q=80&w=800',
    stock: 35,
    featured: true
  },
  {
    id: '3',
    name: 'Aloe Vera Calming Wash',
    category: 'Hand Wash',
    price: 17.00,
    description: 'Deeply hydrating formula from aloe vera for sensitive skin. Restores moisture instantly.',
    ingredients: ['Aloe Vera Juice', 'Chamomile', 'Cucumber Extract'],
    imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800',
    stock: 20,
    featured: true
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: '1',
    title: 'The Benefits of Vegan Skincare',
    excerpt: 'Discover why plant-based products are better for your skin and our planet.',
    content: 'Long article content...',
    date: '2024-03-20',
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800'
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 't1',
    name: 'Minh Huyen',
    role: 'Founder',
    imageUrl: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 't2',
    name: 'Marcus Thorne',
    role: 'Product Lead',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 't3',
    name: 'Sophia Chen',
    role: 'Sustainability',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 't4',
    name: 'Julian Vance',
    role: 'Creative',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 't5',
    name: 'Elena Moss',
    role: 'Chief Botanist',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400'
  }
];
