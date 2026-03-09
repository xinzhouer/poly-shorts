import { Series, Episode } from '../types';

// Helper to generate episodes
const generateEpisodes = (seriesId: string, count: number): Episode[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${seriesId}_ep_${i + 1}`,
    seriesId,
    episodeNumber: i + 1,
    title: `Episode ${i + 1}`,
    thumbnailUrl: `https://placehold.co/1080x1920/2a2a2a/ffffff/png?text=Episode+${i + 1}`,
    // Using a sample video. In a real app, this would be a vertical video URL.
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 120,
    likes: Math.floor(Math.random() * 10000),
    comments: Math.floor(Math.random() * 1000),
    shares: Math.floor(Math.random() * 500),
  }));
};

export const MOCK_SERIES: Series[] = [
  {
    id: 's1',
    title: 'Return of the Dragon King',
    description: 'After three years of humiliation as a live-in son-in-law, the Dragon King returns! He was the son of the world\'s richest man but chose to hide his identity to repay a debt of gratitude. Now, the time has come to reclaim what belongs to him...',
    coverUrl: 'https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=portrait+of+a+powerful+asian+man+in+a+luxury+suit+standing+in+front+of+a+skyscraper+with+a+golden+dragon+aura%2C+epic+movie+poster+style%2C+high+contrast&image_size=portrait_9_16',
    status: 'Ongoing',
    tags: ['Urban', 'Revenge', 'Underdog'],
    totalEpisodes: 50,
    rating: 9.8,
    author: 'Tomato Shorts',
  },
  {
    id: 's2',
    title: 'Reborn as a Billionaire Heiress',
    description: 'Betrayed and killed by her husband and best friend in her past life, she is reborn three years earlier. This time, she will tear apart the cheater, crush the green tea friend, and reclaim her rightful inheritance as the billionaire heiress!',
    coverUrl: 'https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=glamorous+young+asian+woman+in+haute+couture+dress+at+a+gala%2C+looking+confident+and+sharp%2C+holding+a+glass+of+champagne%2C+luxurious+background&image_size=portrait_9_16',
    status: 'Completed',
    tags: ['Rebirth', 'Revenge', 'Luxury'],
    totalEpisodes: 45,
    rating: 9.5,
    author: 'Red Fruit Original',
  },
  {
    id: 's3',
    title: 'The CEO\'s Contract Wife',
    description: 'A marriage contract binds her to the cold-hearted CEO. She thought it was just a business deal, but who knew the aloof CEO would turn into a doting husband?',
    coverUrl: 'https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=romantic+scene+of+a+cold+handsome+ceo+and+a+sweet+girl+in+a+wedding+dress+looking+at+each+other%2C+soft+lighting%2C+k-drama+style&image_size=portrait_9_16',
    status: 'Ongoing',
    tags: ['Romance', 'CEO', 'Love'],
    totalEpisodes: 60,
    rating: 9.2,
    author: 'Sweet Theater',
  },
  {
    id: 's4',
    title: 'The Mystic General',
    description: 'He commanded millions of soldiers but returned to the city to protect his wife and daughter. Those who dare to touch his family will face the wrath of the Mystic General.',
    coverUrl: 'https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=tough+military+general+in+casual+clothes+protecting+a+little+girl%2C+urban+setting%2C+action+movie+vibes%2C+intense+look&image_size=portrait_9_16',
    status: 'Completed',
    tags: ['Action', 'Family', 'Hero'],
    totalEpisodes: 40,
    rating: 9.6,
    author: 'Power Drama',
  },
  {
    id: 's5',
    title: 'Flash Marriage with a Stranger',
    description: 'Forced to marry a stranger by her family, she didn\'t expect her new husband to be the mysterious billionaire everyone is talking about.',
    coverUrl: 'https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=couple+holding+hands+showing+wedding+rings+in+a+coffee+shop%2C+modern+romance%2C+warm+tones%2C+cinematic&image_size=portrait_9_16',
    status: 'Ongoing',
    tags: ['Romance', 'Marriage', 'Secret'],
    totalEpisodes: 55,
    rating: 9.3,
    author: 'Love Story Lab',
  }
];

export const MOCK_EPISODES: Record<string, Episode[]> = {
  's1': generateEpisodes('s1', 50),
  's2': generateEpisodes('s2', 45),
  's3': generateEpisodes('s3', 60),
  's4': generateEpisodes('s4', 40),
  's5': generateEpisodes('s5', 55),
};

export const getSeriesById = (id: string): Series | undefined => {
  return MOCK_SERIES.find(s => s.id === id);
};

export const getEpisodesBySeriesId = (id: string): Episode[] => {
  return MOCK_EPISODES[id] || [];
};

export const getEpisode = (seriesId: string, episodeNumber: number): Episode | undefined => {
  const episodes = MOCK_EPISODES[seriesId];
  return episodes?.find(e => e.episodeNumber === Number(episodeNumber));
};
