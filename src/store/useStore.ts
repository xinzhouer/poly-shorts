import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Series, Episode } from '../types';
import { MOCK_SERIES, MOCK_EPISODES } from '../data/mock';

interface AppState {
  series: Series[];
  episodes: Record<string, Episode[]>;
  history: Record<string, number>; // seriesId -> last watched episode number
  
  // Actions
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
      // Only persist history and user uploaded content (if we wanted to persist uploaded data metadata, 
      // but since blob URLs expire, we might not want to persist everything blindly. 
      // For MVP simplicity, we persist everything, but warn user that uploads are session-only if blobs expire)
      partialize: (state) => ({ history: state.history }), 
    }
  )
);
