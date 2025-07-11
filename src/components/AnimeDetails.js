'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AnimeRow from './AnimeRow';
import SeasonRow from './SeasonRow';
import { fetchAnimeEpisodes } from '@/lib/api';

export default function AnimeDetails({ anime }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeTab, setActiveTab] = useState('synopsis');
  const [synopsisOverflows, setSynopsisOverflows] = useState(false);
  const [firstEpisodeId, setFirstEpisodeId] = useState(null);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);
  const synopsisRef = useRef(null);
  
  // Check if synopsis overflows when component mounts or when content changes
  useEffect(() => {
    if (synopsisRef.current) {
      const element = synopsisRef.current;
      setSynopsisOverflows(element.scrollHeight > element.clientHeight);
    }
  }, [anime?.info?.description, activeTab]);
  
  // Fetch first episode ID when component mounts
  useEffect(() => {
    const fetchFirstEpisode = async () => {
      if (anime?.info?.id) {
        setIsLoadingEpisodes(true);
        try {
          console.log(`[AnimeDetails] Fetching episodes for anime: ${anime.info.id}`);
          const response = await fetchAnimeEpisodes(anime.info.id);
          console.log('[AnimeDetails] Episodes response:', response);
          
          if (response.episodes && response.episodes.length > 0) {
            // Log the first episode to check its structure
            console.log('[AnimeDetails] First episode:', response.episodes[0]);
            
            // Get the first episode's id
            const firstEp = response.episodes[0];
            if (firstEp.id) {
              setFirstEpisodeId(firstEp.id);
              console.log(`[AnimeDetails] First episode ID found: ${firstEp.id}`);
            } else if (firstEp.episodeId) {
              // Fallback to episodeId if id is not available
              setFirstEpisodeId(firstEp.episodeId);
              console.log(`[AnimeDetails] Falling back to episodeId: ${firstEp.episodeId}`);
            } else {
              // If no episode ID is found in the API response, create a fallback ID
              const fallbackId = `${anime.info.id}?ep=1`;
              setFirstEpisodeId(fallbackId);
              console.log(`[AnimeDetails] Using fallback ID: ${fallbackId}`);
            }
          } else if (anime.info.id) {
            // If no episodes found but anime ID is available, use fallback
            const fallbackId = `${anime.info.id}?ep=1`;
            setFirstEpisodeId(fallbackId);
            console.log(`[AnimeDetails] No episodes found, using fallback ID: ${fallbackId}`);
          } else {
            console.warn('[AnimeDetails] No episodes found and no anime ID available');
          }
        } catch (error) {
          console.error('[AnimeDetails] Error fetching episodes:', error);
          // Even on error, try to use fallback
          if (anime.info.id) {
            const fallbackId = `${anime.info.id}?ep=1`;
            setFirstEpisodeId(fallbackId);
            console.log(`[AnimeDetails] Error occurred, using fallback ID: ${fallbackId}`);
          }
        } finally {
          setIsLoadingEpisodes(false);
        }
      }
    };
    
    fetchFirstEpisode();
  }, [anime?.info?.id]);
  
  // Add a useEffect to debug when and why firstEpisodeId changes
  useEffect(() => {
    console.log('[AnimeDetails] firstEpisodeId changed:', firstEpisodeId);
  }, [firstEpisodeId]);
  
  if (!anime?.info) {
    return null;
  }
  
  const { info, moreInfo, relatedAnime, recommendations, seasons } = anime;
  const hasCharacters = info.characterVoiceActor?.length > 0 || info.charactersVoiceActors?.length > 0;
  const hasVideos = info.promotionalVideos && info.promotionalVideos.length > 0;

  // Build the watch URL based on the first episode ID
  const watchUrl = firstEpisodeId 
    ? `/watch/${firstEpisodeId}` 
    : ''; // Empty string if no episodes available - this shouldn't happen with our fallback

  // Add debug log here
  console.log('[AnimeDetails] Rendered with watchUrl:', watchUrl, 'firstEpisodeId:', firstEpisodeId);

  // Video modal for promotional videos
  const VideoModal = ({ video, onClose }) => {
    if (!video) return null;
    
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 backdrop-blur-sm">
        <div className="relative w-full max-w-4xl bg-[var(--card)] rounded-lg overflow-hidden shadow-2xl border border-gray-700 animate-fadeIn">
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 z-10 bg-black/50 rounded-full p-1.5 hover:bg-black/70 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="aspect-video w-full">
            <iframe
              src={video.source}
              title={video.title || "Promotional Video"}
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    );
  };

  // Format status with aired date
  const getStatusWithAired = () => {
    let status = moreInfo?.status || '';
    if (moreInfo?.aired) {
      status += ` (${moreInfo.aired})`;
    }
    return status;
  };

  return (
    <div className="relative">
      {/* Video Modal */}
      {activeVideo && <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
    
      {/* Background Image with Gradient Overlay - Desktop Only */}
      <div className="absolute inset-0 h-[180px] md:h-[400px] overflow-hidden -z-10">
        {info.poster && (
          <>
            <Image
              src={info.poster}
              alt={info.name}
              fill
              className="object-cover opacity-18"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(0,0,0,0.6)] to-[var(--background)]"></div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 md:px-4 pt-3 md:pt-10">
        {/* MOBILE LAYOUT - Only visible on mobile */}
        <div className="md:hidden">
          <div className="flex flex-col mb-5">
            {/* Mobile Header with Title + Rating */}
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-bold text-white pr-3">{info.name}</h1>
              {info.stats?.rating && (
                <div className="flex items-center bg-[var(--card)] px-2 py-1 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 text-yellow-400 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white text-xs font-medium">{info.stats.rating}</span>
                </div>
              )}
            </div>
            
            {/* Japanese Title */}
            {moreInfo?.japanese && (
              <h2 className="text-xs text-gray-300 mt-[-0.25rem] mb-3">{moreInfo.japanese}</h2>
            )}
            
            {/* Mobile Two-Column Layout */}
            <div className="flex gap-3">
              {/* Left Column - Poster */}
              <div className="w-2/5 flex-shrink-0">
                <div className="bg-[var(--card)] rounded-xl overflow-hidden shadow-lg border border-gray-800">
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={info.poster}
                      alt={info.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
              
              {/* Right Column - Info Card */}
              <div className="w-3/5 flex flex-col">
                {/* Type & Episodes on same row */}
                <div className="flex gap-2 mb-2">
                  {info.stats?.type && (
                    <div className="bg-[var(--card)] px-2 py-1 rounded-md text-[10px] text-white">{info.stats.type}</div>
                  )}
                  
                  {info.stats?.episodes && (
                    <div className="bg-[var(--card)] px-2 py-1 rounded-md text-[10px] text-white grow">
                      {info.stats.episodes.sub > 0 && `Sub: ${info.stats.episodes.sub}`}
                      {info.stats.episodes.dub > 0 && info.stats.episodes.sub > 0 && ' • '}
                      {info.stats.episodes.dub > 0 && `Dub: ${info.stats.episodes.dub}`}
                    </div>
                  )}
                </div>
                
                {/* Clean Info Layout */}
                <div className="bg-[var(--card)] rounded-md p-2.5 text-[11px] space-y-1.5 mb-2">
                  {/* Status */}
                  {moreInfo?.status && (
                    <div className="flex">
                      <span className="text-gray-400 w-16">Status:</span>
                      <span className="text-white">{getStatusWithAired()}</span>
                    </div>
                  )}
                  
                  {/* Quality */}
                  {info.stats?.quality && (
                    <div className="flex">
                      <span className="text-gray-400 w-16">Quality:</span>
                      <span className="text-white">{info.stats.quality}</span>
                    </div>
                  )}
                  
                  {/* Duration */}
                  {info.stats?.duration && (
                    <div className="flex">
                      <span className="text-gray-400 w-16">Duration:</span>
                      <span className="text-white">{info.stats.duration}</span>
                    </div>
                  )}
                  
                  {/* Studio */}
                  {moreInfo?.studios && (
                    <div className="flex">
                      <span className="text-gray-400 w-16">Studio:</span>
                      <span className="text-white">{moreInfo.studios}</span>
                    </div>
                  )}
                </div>
                
                {/* Mobile Genres */}
                {moreInfo?.genres && moreInfo.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {moreInfo.genres.slice(0, 5).map((genre, index) => (
                      <Link
                        key={index}
                        href={`/genre/${genre.toLowerCase()}`}
                        className="bg-[var(--card)] px-2 py-0.5 rounded-md text-[10px] text-gray-300 hover:text-white"
                      >
                        {genre}
                      </Link>
                    ))}
                    {moreInfo.genres.length > 5 && (
                      <span className="text-[10px] text-gray-500 self-center">+{moreInfo.genres.length - 5}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Watch Button - Mobile */}
            {firstEpisodeId && (
              <Link 
                href={watchUrl}
                className="bg-[#ffffff] text-[var(--background)] px-4 py-2.5 rounded-xl mt-3 hover:opacity-90 transition-opacity flex items-center justify-center font-medium text-sm w-full shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 mr-1.5"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
                <span>Start Watching</span>
              </Link>
            )}
          </div>
        </div>

        {/* DESKTOP LAYOUT - Only visible on desktop */}
        <div className="hidden md:flex md:flex-row gap-10 mb-8">
          {/* Poster */}
          <div className="w-1/4 max-w-[240px]">
            <div className="bg-[var(--card)] rounded-xl overflow-hidden shadow-lg border border-gray-800">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={info.poster}
                  alt={info.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            
            {/* Watch Button - Desktop */}
            {firstEpisodeId && (
              <Link 
                href={watchUrl}
                className="bg-[#ffffff] text-[var(--background)] px-6 py-3 rounded-xl mt-4 hover:opacity-90 transition-opacity flex items-center justify-center font-medium text-base w-full shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5 mr-2"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
                <span>Start Watching</span>
              </Link>
            )}
          </div>

          {/* Title and Metadata */}
          <div className="flex-1 pt-2">
            {/* Title Section */}
            <div className="text-left">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                {info.name}
              </h1>
              
              {moreInfo?.japanese && (
                <h2 className="text-base md:text-lg text-gray-400 mb-2">{moreInfo.japanese}</h2>
              )}
              
              {/* Synonyms */}
              {moreInfo?.synonyms && (
                <div className="mt-2 mb-4">
                  <p className="text-sm text-gray-400 italic">{moreInfo.synonyms}</p>
                </div>
              )}
            </div>
            
            {/* Status Badges */}
            <div className="flex flex-wrap justify-start gap-2 my-4">
              {info.stats?.rating && (
                <div className="flex items-center bg-[var(--card)] px-3 py-1.5 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-yellow-400 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white text-sm font-medium">{info.stats.rating}</span>
                </div>
              )}
              
              {/* Status with Aired Date */}
              {moreInfo?.status && (
                <div className="bg-[var(--card)] px-3 py-1.5 rounded-full text-sm text-white">
                  {getStatusWithAired()}
                </div>
              )}
              
              {info.stats?.type && (
                <div className="bg-[var(--card)] px-3 py-1.5 rounded-full text-sm text-white">
                  {info.stats.type}
                </div>
              )}
              
              {info.stats?.episodes && (
                <div className="bg-[var(--card)] px-3 py-1.5 rounded-full text-sm text-white">
                  {info.stats.episodes.sub > 0 && `SUB ${info.stats.episodes.sub}`}
                  {info.stats.episodes.dub > 0 && info.stats.episodes.sub > 0 && ' | '}
                  {info.stats.episodes.dub > 0 && `DUB ${info.stats.episodes.dub}`}
                </div>
              )}
              
              {info.stats?.quality && (
                <div className="bg-[var(--card)] px-3 py-1.5 rounded-full text-sm text-white">
                  {info.stats.quality}
                </div>
              )}
              
              {info.stats?.duration && (
                <div className="bg-[var(--card)] px-3 py-1.5 rounded-full text-sm text-white">
                  {info.stats.duration}
                </div>
              )}
            </div>
            
            {/* Genres & Studios */}
            <div className="space-y-4 mt-4">
              {/* Genres */}
              {moreInfo?.genres && moreInfo.genres.length > 0 && (
                <div>
                  <h3 className="text-white text-base font-medium mb-3 text-left">Genres</h3>
                  <div className="flex flex-wrap justify-start gap-2">
                    {moreInfo.genres.map((genre, index) => (
                      <Link
                        key={index}
                        href={`/genre/${genre.toLowerCase()}`}
                        className="px-3 py-1.5 bg-[var(--card)] text-gray-300 text-sm rounded-full whitespace-nowrap hover:text-white transition-colors hover:bg-[var(--card-hover)]"
                      >
                        {genre}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Studios */}
              {moreInfo?.studios && (
                <div>
                  <h3 className="text-white text-base font-medium mb-3 text-left">Studios</h3>
                  <div className="flex flex-wrap justify-start gap-2">
                    <div className="px-3 py-1.5 bg-[var(--card)] text-gray-300 text-sm rounded-full hover:text-white">
                      {moreInfo.studios}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Tabs Section - Different for Mobile/Desktop */}
        <div className="bg-[var(--card)] rounded-lg mb-6 shadow-lg border border-gray-800">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-800">
            {/* Synopsis Tab */}
            <button 
              className={`px-4 py-2.5 md:py-3 text-sm md:text-base font-medium transition-colors flex-1 md:flex-none ${activeTab === 'synopsis' ? 'text-white border-b-2 border-[var(--primary)]' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('synopsis')}
            >
              Synopsis
            </button>
            
            {/* Characters Tab */}
            {hasCharacters && (
              <button 
                className={`px-4 py-2.5 md:py-3 text-sm md:text-base font-medium transition-colors flex-1 md:flex-none ${activeTab === 'characters' ? 'text-white border-b-2 border-[var(--primary)]' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('characters')}
              >
                Characters
              </button>
            )}
            
            {/* Videos Tab */}
            {hasVideos && (
              <button 
                className={`px-4 py-2.5 md:py-3 text-sm md:text-base font-medium transition-colors flex-1 md:flex-none ${activeTab === 'videos' ? 'text-white border-b-2 border-[var(--primary)]' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('videos')}
              >
                <span>Videos</span>
              </button>
            )}
          </div>
          
          {/* Tab Content */}
          <div className="p-3 md:p-5">
            {/* Synopsis Tab */}
            {activeTab === 'synopsis' && (
              <div>
                <p 
                  ref={synopsisRef}
                  className={`text-gray-300 leading-relaxed text-xs md:text-base ${!isExpanded ? 'line-clamp-4 md:line-clamp-6' : ''}`}
                >
                  {info.description || 'No description available for this anime.'}
                </p>
                {synopsisOverflows && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-[var(--primary)] hover:underline text-xs md:text-sm mt-2 md:mt-3 font-medium"
                  >
                    {isExpanded ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </div>
            )}
            
            {/* Characters Tab */}
            {activeTab === 'characters' && hasCharacters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[60vh] md:max-h-[70vh] overflow-y-auto">
                {(info.characterVoiceActor || info.charactersVoiceActors || []).map((item, index) => (
                  <div key={index} className="bg-[var(--background)] rounded overflow-hidden flex">
                    {/* Character Image */}
                    <div className="relative w-[40px] md:w-[60px] h-[50px] md:h-[72px] flex-shrink-0">
                      <Image
                        src={item.character.poster}
                        alt={item.character.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Text content in the middle */}
                    <div className="flex-1 py-1 md:py-2.5 px-2 md:px-3 flex flex-col justify-center min-w-0">
                      <div className="flex justify-between items-center gap-1 md:gap-3">
                        {/* Character Name */}
                        <div className="min-w-0 flex-1">
                          <p className="text-white font-medium text-xs md:text-sm truncate">{item.character.name}</p>
                          <p className="text-[10px] md:text-xs text-gray-400 truncate">{item.character.cast || 'Main'}</p>
                        </div>
                        
                        {/* Voice Actor Name */}
                        <div className="min-w-0 flex-1 text-right">
                          <p className="text-white font-medium text-xs md:text-sm truncate">{item.voiceActor.name}</p>
                          <p className="text-[10px] md:text-xs text-gray-400 truncate">{item.voiceActor.cast || 'Japanese'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Voice Actor Image */}
                    <div className="relative w-[40px] md:w-[60px] h-[50px] md:h-[72px] flex-shrink-0">
                      <Image
                        src={item.voiceActor.poster}
                        alt={item.voiceActor.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Videos Tab */}
            {activeTab === 'videos' && hasVideos && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {info.promotionalVideos.map((video, index) => (
                  <div 
                    key={index} 
                    className="relative aspect-video cursor-pointer group overflow-hidden rounded"
                    onClick={() => setActiveVideo(video)}
                  >
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[var(--primary)] flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <Image
                      src={video.thumbnail || '/images/video-placeholder.jpg'}
                      alt={video.title || `Promotional Video ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Seasons Section */}
        {seasons && seasons.length > 0 && (
          <SeasonRow title="Seasons" seasons={seasons} />
        )}
        
        {/* Related Anime Section */}
        {relatedAnime && relatedAnime.length > 0 && (
          <AnimeRow title="Related Anime" animeList={relatedAnime} />
        )}
        
        {/* Recommendations Section */}
        {recommendations && recommendations.length > 0 && (
          <AnimeRow title="You May Also Like" animeList={recommendations} />
        )}
      </div>
    </div>
  );
}