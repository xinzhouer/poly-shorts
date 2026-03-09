import React from 'react';
import { Series } from '../types';
import { Link } from 'react-router-dom';

interface SeriesCardProps {
  series: Series;
}

export const SeriesCard: React.FC<SeriesCardProps> = ({ series }) => {
  return (
    <Link to={`/series/${series.id}`} className="block group relative overflow-hidden rounded-lg aspect-[2/3] bg-neutral-800">
      <img 
        src={series.coverUrl} 
        alt={series.title} 
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-2.5">
        <h3 className="text-white font-bold text-sm line-clamp-1 mb-0.5">{series.title}</h3>
        <p className="text-neutral-300 text-xs line-clamp-1 opacity-80">{series.description}</p>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {series.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded text-neutral-200 backdrop-blur-sm border border-white/5">
              {tag}
            </span>
          ))}
        </div>
      </div>
      {series.status === 'Ongoing' && (
        <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold shadow-sm">
          ONGOING
        </div>
      )}
      {series.status === 'Completed' && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-sm font-bold shadow-sm">
          COMPLETED
        </div>
      )}
    </Link>
  );
};
