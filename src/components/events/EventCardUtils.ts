
/**
 * Provides utility functions for EventCard component
 */

// Real image URLs for events based on category
export const categoryImages = {
  'music': 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
  'technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475',
  'arts': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'business': 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
  'sports': 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
  'food': 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
  'education': 'https://images.unsplash.com/photo-1518770660439-4636190af475',
  'health': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'other': 'https://images.unsplash.com/photo-1648737966661-04c66ab467e5'
};

/**
 * Get image URL based on event category or use the event's image if provided
 */
export const getEventImageUrl = (imageUrl: string | undefined, category: string): string => {
  if (imageUrl) return imageUrl;
  
  return categoryImages[category.toLowerCase() as keyof typeof categoryImages] || '/placeholder.svg';
};

/**
 * Prepare price data for display
 * Ensures higher price standard (>1000) for Nepali currency
 */
export const prepareEventPrice = (price: number | string): { priceValue: number, displayPrice: number } => {
  // Parse the price to ensure it's a number for comparison
  const priceValue = typeof price === 'string' ? parseFloat(price) : (price || 0);
  
  // If price is less than 1000, we adjust it for display purposes only (Nepali currency standard)
  const displayPrice = priceValue > 0 && priceValue < 1000 ? priceValue * 1000 : priceValue;
  
  return { priceValue, displayPrice };
};
