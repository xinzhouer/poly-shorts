import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { EpisodeList } from '../components/EpisodeList';
import { ChevronLeft, Share2, Heart, Play } from 'lucide-react';

export const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const series = useStore(state => state.series.find(s => s.id === id));
  const episodes = useStore(state => state.episodes[id || ''] || []);

  if (!series) return <div className="p-4 text-center text-white mt-10">Series not found</div>;

  return (
    <div className="min-h-screen bg-neutral-900 pb-10">
      {/* Header Image with Back Button */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {/* Blurred background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm scale-110"
          style={{ backgroundImage: `url(${series.coverUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
        
        <header className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10 safe-area-top">
          <button onClick={() => navigate(-1)} className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <button className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors">
            <Share2 size={20} />
          </button>
        </header>

        <div className="absolute bottom-0 left-0 w-full p-4 flex gap-4 items-end translate-y-2">
           <img src={series.coverUrl} className="w-24 h-32 rounded-md shadow-2xl object-cover border border-white/10" alt={series.title} />
           <div className="flex-1 mb-2">
             <h1 className="text-xl font-bold text-white mb-1 drop-shadow-md">{series.title}</h1>
             <div className="flex flex-wrap gap-2 text-xs text-neutral-300 mb-2">
               {series.tags.map(tag => <span key={tag} className="bg-white/10 backdrop-blur px-1.5 py-0.5 rounded border border-white/5">{tag}</span>)}
             </div>
             <p className="text-xs text-neutral-400 flex items-center gap-2">
               <span className={series.status === 'Ongoing' ? "text-red-400" : "text-blue-400"}>{series.status}</span>
               <span className="w-0.5 h-3 bg-neutral-600"></span>
               <span>{series.totalEpisodes} Eps</span>
               <span className="w-0.5 h-3 bg-neutral-600"></span>
               <span className="text-yellow-500 font-bold">{series.rating}</span>
             </p>
           </div>
        </div>
      </div>

      <div className="p-4 pt-6">
        {/* Actions */}
        <div className="flex gap-3 mb-6">
           <button 
             onClick={() => navigate(`/player/${series.id}/${episodes[0]?.id}`)}
             className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-900/30 active:scale-95"
           >
             <Play size={18} fill="currentColor" />
             Play Now
           </button>
           <button className="flex-none w-12 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full flex items-center justify-center transition-colors active:scale-95">
             <Heart size={20} />
           </button>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="font-bold text-white mb-2 text-sm opacity-90">Synopsis</h3>
          <p className="text-sm text-neutral-400 leading-relaxed text-justify">{series.description}</p>
        </div>

        {/* Episodes */}
        <div>
          <div className="flex justify-between items-center mb-4 sticky top-14 bg-neutral-900 py-2 z-10 border-b border-neutral-800/50">
            <h3 className="font-bold text-white text-base">Episodes</h3>
            <span className="text-xs text-neutral-500">Updated to {episodes.length}</span>
          </div>
          <EpisodeList episodes={episodes} seriesId={series.id} />
        </div>
      </div>
    </div>
  );
};
