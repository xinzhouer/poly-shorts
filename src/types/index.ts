export interface Series {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  status: 'Ongoing' | 'Completed';
  tags: string[];
  totalEpisodes: number;
  rating: number;
  author: string;
}

export interface Episode {
  id: string;
  seriesId: string;
  episodeNumber: number;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number; // in seconds
  likes: number;
  comments: number;
  shares: number;
}
