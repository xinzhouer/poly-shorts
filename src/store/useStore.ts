import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Series, Episode } from '../types';
import { MOCK_SERIES, MOCK_EPISODES } from '../data/mock';
import { supabase } from '../lib/supabase';

interface AppState {
  series: Series[];
  episodes: Record<string, Episode[]>;
  history: Record<string, number>; // seriesId -> last watched episode number
  isLoading: boolean;
  
  // Actions
  fetchData: () => Promise<void>;
  addSeries: (series: Series) => void;
  addEpisode: (episode: Episode) => void;
  addToHistory: (seriesId: string, episodeNumber: number) => void;
  getHistory: (seriesId: string) => number | undefined;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      series: MOCK_SERIES,
      episodes: MOCK_EPISODES,
      history: {},
      isLoading: false,
      
      fetchData: async () => {
        set({ isLoading: true });
        try {
          const { data: seriesData, error: seriesError } = await supabase
            .from('series')
            .select('*')
            .order('created_at', { ascending: false });

          if (seriesError) throw seriesError;

          const { data: episodesData, error: episodesError } = await supabase
            .from('episodes')
            .select('*')
            .order('episode_number', { ascending: true });

          if (episodesError) throw episodesError;

          if (seriesData && seriesData.length > 0) {
            // Transform database snake_case to camelCase if needed, or just map manually
            // Since we used snake_case in SQL but types are camelCase, we need to map
            const formattedSeries: Series[] = seriesData.map((s: any) => ({
              id: s.id,
              title: s.title,
              description: s.description,
              coverUrl: s.cover_url,
              status: s.status,
              tags: s.tags,
              totalEpisodes: s.total_episodes,
              author: s.author,
              rating: s.rating,
            }));

            const formattedEpisodes: Record<string, Episode[]> = {};
            episodesData?.forEach((e: any) => {
              if (!formattedEpisodes[e.series_id]) {
                formattedEpisodes[e.series_id] = [];
              }
              formattedEpisodes[e.series_id].push({
                id: e.id,
                seriesId: e.series_id,
                episodeNumber: e.episode_number,
                title: e.title,
                thumbnailUrl: e.thumbnail_url,
                videoUrl: e.video_url,
                duration: e.duration,
                likes: e.likes,
                comments: e.comments,
                shares: e.shares,
              });
            });

            set({ series: formattedSeries, episodes: formattedEpisodes });
          }
        } catch (error) {
          console.error('Error fetching data from Supabase:', error);
          // Fallback to mock data is already set by default
        } finally {
          set({ isLoading: false });
        }
      },

      addSeries: (newSeries) => 
        set((state) => ({ series: [newSeries, ...state.series] })),
        
      addEpisode: (newEpisode) => 
        set((state) => {
          const seriesEpisodes = state.episodes[newEpisode.seriesId] || [];
          return {
            episodes: {
              ...state.episodes,
              [newEpisode.seriesId]: [...seriesEpisodes, newEpisode]
            }
          };
        }),

      addToHistory: (seriesId, episodeNumber) =>
        set((state) => ({
          history: { ...state.history, [seriesId]: episodeNumber },
        })),
        
      getHistory: (seriesId) => get().history[seriesId],
    }),
    {
      name: 'manju-storage',
      partialize: (state) => ({ history: state.history }), 
    }
  )
);
