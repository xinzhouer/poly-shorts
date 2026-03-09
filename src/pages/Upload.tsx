import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ChevronLeft, Upload as UploadIcon, Image, Video } from 'lucide-react';
import { Series, Episode } from '../types';

export const Upload: React.FC = () => {
  const navigate = useNavigate();
  const { addSeries, addEpisode } = useStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('Me');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !coverFile || !videoFile) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate IDs
      const seriesId = `s_${Date.now()}`;
      const episodeId = `${seriesId}_ep_1`;

      // Create object URLs for preview (Note: these are temporary and will expire on refresh)
      const coverUrl = URL.createObjectURL(coverFile);
      const videoUrl = URL.createObjectURL(videoFile);

      const newSeries: Series = {
        id: seriesId,
        title,
        description,
        coverUrl,
        status: 'Ongoing',
        tags: ['User Upload', 'Shorts'],
        totalEpisodes: 1,
        rating: 5.0,
        author,
      };

      const newEpisode: Episode = {
        id: episodeId,
        seriesId,
        episodeNumber: 1,
        title: 'Episode 1',
        thumbnailUrl: coverUrl, // Reuse cover as thumbnail for simplicity
        videoUrl,
        duration: 60, // Mock duration
        likes: 0,
        comments: 0,
        shares: 0,
      };

      // Add to store
      addSeries(newSeries);
      addEpisode(newEpisode);

      // Navigate to the new series
      navigate(`/series/${seriesId}`);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-4 pb-20">
      <header className="flex items-center gap-4 mb-6 sticky top-0 bg-neutral-900/90 backdrop-blur py-2 z-10">
        <button onClick={() => navigate(-1)} className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Upload Short Drama</h1>
      </header>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-6 text-xs text-yellow-200">
        Note: This is a local preview mode. Uploaded content is stored in memory and will disappear if you refresh the page.
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Series Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="e.g. My Amazing Story"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none h-24 resize-none"
              placeholder="Tell us about your story..."
            />
          </div>

           <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Author Name</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Your Name"
            />
          </div>
        </div>

        {/* File Uploads */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Cover Image (Vertical 9:16)</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                className="hidden"
                id="cover-upload"
              />
              <label
                htmlFor="cover-upload"
                className="flex items-center gap-3 p-3 bg-neutral-800 border border-dashed border-neutral-600 rounded-lg cursor-pointer hover:bg-neutral-750 transition-colors"
              >
                <div className="w-12 h-16 bg-neutral-700 rounded flex items-center justify-center text-neutral-400">
                  {coverFile ? (
                    <img src={URL.createObjectURL(coverFile)} className="w-full h-full object-cover rounded" alt="Preview" />
                  ) : (
                    <Image size={24} />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">{coverFile ? coverFile.name : 'Select Cover Image'}</p>
                  <p className="text-xs text-neutral-500">Tap to browse</p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">First Episode Video</label>
            <div className="relative">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="flex items-center gap-3 p-3 bg-neutral-800 border border-dashed border-neutral-600 rounded-lg cursor-pointer hover:bg-neutral-750 transition-colors"
              >
                <div className="w-12 h-16 bg-neutral-700 rounded flex items-center justify-center text-neutral-400">
                   {videoFile ? <Video size={24} className="text-red-500" /> : <Video size={24} />}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">{videoFile ? videoFile.name : 'Select Video File'}</p>
                  <p className="text-xs text-neutral-500">Tap to browse</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-4 rounded-full shadow-lg shadow-red-900/30 active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            'Uploading...'
          ) : (
            <>
              <UploadIcon size={20} />
              Upload & Publish
            </>
          )}
        </button>
      </form>
    </div>
  );
};
