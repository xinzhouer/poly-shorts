import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ChevronLeft, MessageSquare, Heart, Share2, List, Play } from 'lucide-react';
import { EpisodeList } from '../components/EpisodeList';
import { AnimatePresence, motion } from 'framer-motion';

export const Player: React.FC = () => {
  const { seriesId, episodeId } = useParams<{ seriesId: string; episodeId: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const series = useStore(state => state.series.find(s => s.id === seriesId));
  const episodes = useStore(state => state.episodes[seriesId || ''] || []);
  const currentEpisodeIndex = episodes.findIndex(e => e.id === episodeId);
  const currentEpisode = episodes[currentEpisodeIndex];
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [showEpisodeList, setShowEpisodeList] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Auto play when episode changes
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => setIsPlaying(false));
      }
      setIsPlaying(true);
    }
  }, [episodeId]);

  // Handle time update for progress bar
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const percent = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(percent);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const goToNext = () => {
    if (currentEpisodeIndex < episodes.length - 1) {
       navigate(`/player/${seriesId}/${episodes[currentEpisodeIndex + 1].id}`);
    }
  };

  const goToPrev = () => {
    if (currentEpisodeIndex > 0) {
       navigate(`/player/${seriesId}/${episodes[currentEpisodeIndex - 1].id}`);
    }
  };

  if (!currentEpisode || !series) return <div className="bg-black text-white h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="h-screen w-full bg-black relative overflow-hidden flex flex-col items-center justify-center">
      {/* Video */}
      <video
        ref={videoRef}
        src={currentEpisode.videoUrl}
        className="w-full h-full object-cover"
        loop
        playsInline
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Play/Pause Overlay Icon */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="bg-black/40 p-4 rounded-full backdrop-blur-sm">
             <Play size={48} fill="white" className="text-white ml-1" />
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-20 safe-area-top bg-gradient-to-b from-black/60 to-transparent">
        <button onClick={() => navigate(-1)} className="text-white p-2 bg-black/10 rounded-full backdrop-blur-sm">
          <ChevronLeft size={28} />
        </button>
      </div>

      {/* Right Sidebar Controls */}
      <div className="absolute right-2 bottom-24 flex flex-col gap-6 items-center z-20 pb-4">
        <div className="flex flex-col items-center gap-1 animate-pulse">
           <div className="bg-neutral-800/80 p-0.5 rounded-full border border-white overflow-hidden w-10 h-10">
             <img src={series.coverUrl} className="w-full h-full object-cover" alt="Author" />
           </div>
        </div>
        <div className="flex flex-col items-center gap-1">
           <Heart size={32} className="text-white drop-shadow-md active:scale-125 transition-transform" />
           <span className="text-white text-xs font-medium shadow-black drop-shadow-md">{currentEpisode.likes}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
           <MessageSquare size={30} className="text-white drop-shadow-md active:scale-125 transition-transform" />
           <span className="text-white text-xs font-medium shadow-black drop-shadow-md">{currentEpisode.comments}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
           <Share2 size={30} className="text-white drop-shadow-md active:scale-125 transition-transform" />
           <span className="text-white text-xs font-medium shadow-black drop-shadow-md">{currentEpisode.shares}</span>
        </div>
      </div>

      {/* Bottom Info Area */}
      <div className="absolute bottom-0 left-0 w-full p-4 pb-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 safe-area-bottom">
        <div className="mb-4 pr-16">
          <h3 className="text-white font-bold text-lg mb-1 drop-shadow-md">@{series.author}</h3>
          <p className="text-white text-sm mb-2 drop-shadow-md line-clamp-2 opacity-90">{series.title} | {currentEpisode.title}</p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-0.5 bg-white/30 rounded-full mb-4 overflow-hidden">
           <div className="h-full bg-red-500" style={{ width: `${progress}%` }} />
        </div>

        {/* Footer Controls */}
        <div className="flex justify-between items-center text-white/90 font-medium text-sm">
           <div className="flex items-center gap-4">
             <button onClick={() => setShowEpisodeList(true)} className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md hover:bg-white/20 transition-colors">
                <List size={16} />
                <span className="text-xs">Episodes</span>
             </button>
             <span className="text-xs opacity-70">Ep {currentEpisode.episodeNumber} / {series.totalEpisodes}</span>
           </div>
           
           <div className="flex items-center gap-4">
              {/* Simple Navigation Buttons for MVP (instead of swipe) */}
              <button onClick={goToPrev} disabled={currentEpisodeIndex === 0} className="disabled:opacity-30 text-xs bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md">Prev</button>
              <span className="w-px h-3 bg-white/30"></span>
              <button onClick={goToNext} disabled={currentEpisodeIndex === episodes.length - 1} className="disabled:opacity-30 text-xs bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md">Next</button>
           </div>
        </div>
      </div>

      {/* Episode Selector Sheet */}
      <AnimatePresence>
        {showEpisodeList && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowEpisodeList(false)}
              className="absolute inset-0 bg-black/60 z-40"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 w-full bg-neutral-900 rounded-t-2xl z-50 max-h-[70vh] flex flex-col safe-area-bottom"
            >
              <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
                <h3 className="text-white font-bold">Episodes</h3>
                <button onClick={() => setShowEpisodeList(false)} className="text-neutral-400 p-2 hover:text-white">✕</button>
              </div>
              <div className="p-4 overflow-y-auto flex-1">
                 <EpisodeList episodes={episodes} seriesId={series.id} currentEpisodeId={currentEpisode.id} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
