import React from 'react';
import { Episode } from '../types';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { Lock, Play } from 'lucide-react';

interface EpisodeListProps {
  episodes: Episode[];
  seriesId: string;
  currentEpisodeId?: string;
}

export const EpisodeList: React.FC<EpisodeListProps> = ({ episodes, seriesId, currentEpisodeId }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-5 gap-3">
      {episodes.map((episode) => {
        const isCurrent = currentEpisodeId === episode.id;
        // Mock logic: first 10 episodes free, others locked (just visual for now)
        const isLocked = episode.episodeNumber > 10;

        return (
          <button
            key={episode.id}
            onClick={() => navigate(`/player/${seriesId}/${episode.id}`)}
            className={clsx(
              "aspect-square rounded-lg flex items-center justify-center text-sm font-medium relative transition-all active:scale-95",
              isCurrent 
                ? "bg-red-600 text-white shadow-lg shadow-red-900/50" 
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            )}
          >
            {isCurrent ? <Play size={14} fill="currentColor" /> : episode.episodeNumber}
            
            {/* Lock icon for future monetization features */}
            {isLocked && !isCurrent && (
               <div className="absolute top-1 right-1 opacity-40 text-yellow-500">
                 <Lock size={10} />
               </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
