import React from 'react';
import { useStore } from '../store/useStore';
import { SeriesCard } from '../components/SeriesCard';
import { Search, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const seriesList = useStore((state) => state.series);
  const navigate = useNavigate();

  return (
    <div className="p-4 pt-0">
      <header className="flex items-center justify-between mb-4 sticky top-0 bg-neutral-900/90 backdrop-blur-md z-10 py-3 -mx-4 px-4 border-b border-neutral-800/50">
        <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent italic tracking-tighter">
          POLY SHORTS
        </h1>
        <div className="flex gap-2">
          <button onClick={() => navigate('/upload')} className="p-2 bg-neutral-800/50 rounded-full text-neutral-400 hover:text-white transition-colors">
            <Upload size={20} />
          </button>
          <button className="p-2 bg-neutral-800/50 rounded-full text-neutral-400 hover:text-white transition-colors">
            <Search size={20} />
          </button>
        </div>
      </header>

      {/* Featured / Banner (Mock) */}
      <div className="mb-8 rounded-xl overflow-hidden relative aspect-video bg-neutral-800 shadow-lg group cursor-pointer">
         <img 
           src="https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=cinematic+shot+of+a+handsome+ceo+in+a+suit+looking+intense+in+a+modern+office+at+night%2C+dramatic+lighting%2C+high+quality%2C+4k&image_size=landscape_16_9" 
           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
           alt="Banner"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent">
            <div className="absolute bottom-0 left-0 w-full p-4">
              <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold mb-2 inline-block">
                Featured
              </span>
              <h2 className="text-lg font-bold text-white mb-1">Trending: Return of the Dragon King</h2>
              <p className="text-xs text-neutral-300 line-clamp-1">The most satisfying revenge story of the year! Watch now...</p>
            </div>
         </div>
      </div>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-white">
            <span className="w-1 h-4 bg-red-500 rounded-full"></span>
            Top Picks
          </h2>
          <button className="text-xs text-neutral-500 hover:text-neutral-300">See All &gt;</button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {seriesList.map(series => (
            <SeriesCard key={series.id} series={series} />
          ))}
          {/* Duplicate for demo filling to show scrolling - only if list is short */}
          {seriesList.length < 10 && seriesList.map(series => (
            <SeriesCard key={`${series.id}_dup1`} series={{...series, id: `${series.id}_dup1`}} />
          ))}
        </div>
      </section>
    </div>
  );
};
