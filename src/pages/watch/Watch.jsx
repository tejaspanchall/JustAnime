/* eslint-disable react/prop-types */
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/src/context/LanguageContext";
import { useWatch } from "@/src/hooks/useWatch";
import BouncingLoader from "@/src/components/ui/bouncingloader/Bouncingloader";
import Episodelist from "@/src/components/episodelist/Episodelist";
import website_name from "@/src/config/website";
import Sidecard from "@/src/components/sidecard/Sidecard";
import {
  faClosedCaptioning,
  faMicrophone,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Servers from "@/src/components/servers/Servers";
import { Skeleton } from "@/src/components/ui/Skeleton/Skeleton";
import SidecardLoader from "@/src/components/Loader/Sidecard.loader";
import Watchcontrols from "@/src/components/watchcontrols/Watchcontrols";
import useWatchControl from "@/src/hooks/useWatchControl";
import Player from "@/src/components/player/Player";
import getSafeTitle from "@/src/utils/getSafetitle";
import { Helmet } from 'react-helmet-async';
import InfoTag from "@/src/components/ui/InfoTag/InfoTag";
import {
  generateDescription,
  generateKeywords,
  generateCanonicalUrl,
  generateOGImage,
  generateAnimeStructuredData,
  generateVideoStructuredData,
  generateBreadcrumbStructuredData,
  optimizeTitle,
} from '@/src/utils/seo.utils';

export default function Watch() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: animeId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  let initialEpisodeId = queryParams.get("ep");
  const { language } = useLanguage();
  const isFirstSet = useRef(true);
  const [showNextEpisodeSchedule, setShowNextEpisodeSchedule] = useState(true);

  const {
    buffering,
    streamInfo,
    streamUrl,
    animeInfo,
    episodes,
    nextEpisodeSchedule,
    animeInfoLoading,
    totalEpisodes,
    isFullOverview,
    intro,
    outro,
    subtitles,
    thumbnail,
    setIsFullOverview,
    activeEpisodeNum,
    episodeId,
    setEpisodeId,
    activeServerId,
    setActiveServerId,
    servers,
    serverLoading,
    activeServerType,
    setActiveServerType,
    activeServerName,
    setActiveServerName,
    seasons
  } = useWatch(animeId, initialEpisodeId);

  const {
    autoPlay,
    setAutoPlay,
    autoSkipIntro,
    setAutoSkipIntro,
    autoNext,
    setAutoNext,
  } = useWatchControl();

  const videoContainerRef = useRef(null);
  const playerRef = useRef(null);
  const episodesRef = useRef(null);

  // Sync URL with episodeId
  useEffect(() => {
    if (!episodes?.length) return;

    const currentEpNum = episodeId;
    const isValidEpisode = episodes.some(ep => ep.id.split('ep=')[1] === currentEpNum);

    if (!currentEpNum || !isValidEpisode) {
      const fallbackId = episodes[0].id.match(/ep=(\d+)/)?.[1];
      if (fallbackId && fallbackId !== currentEpNum) setEpisodeId(fallbackId);
      return;
    }

    const newUrl = `/watch/${animeId}?ep=${currentEpNum}`;
    if (isFirstSet.current) {
      navigate(newUrl, { replace: true });
      isFirstSet.current = false;
    } else {
      navigate(newUrl);
    }
  }, [episodeId, animeId, navigate, episodes, setEpisodeId]);

  // Redirect if no episodes
  useEffect(() => {
    if (totalEpisodes === 0) navigate(`/${animeId}`);
  }, [animeId, totalEpisodes, navigate]);

  // Height adjustment logic
  const adjustHeight = useCallback(() => {
    if (window.innerWidth > 1200) {
      if (playerRef.current && episodesRef.current) {
        episodesRef.current.style.height = 'auto';
        episodesRef.current.style.maxHeight = `${playerRef.current.offsetHeight}px`;
      }
    } else if (episodesRef.current) {
      episodesRef.current.style.height = 'auto';
      episodesRef.current.style.maxHeight = 'none';
    }
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(adjustHeight);

    if (playerRef.current) resizeObserver.observe(playerRef.current);

    window.addEventListener('resize', adjustHeight);
    adjustHeight();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', adjustHeight);
    };
  }, [adjustHeight, buffering, animeInfoLoading]);

  const seoData = useMemo(() => {
    if (!animeInfo) return null;
    const safeT = getSafeTitle(animeInfo.title, language, animeInfo.japanese_title);
    return {
      safeTitle: safeT,
      pageTitle: optimizeTitle(`Watch ${safeT} Episode ${activeEpisodeNum} Sub Dub Online Free`),
      pageDescription: generateDescription(`Stream ${safeT} Episode ${activeEpisodeNum} in HD with English Sub and Dub. ${animeInfo.animeInfo?.Overview}`),
      pageKeywords: `${generateKeywords(animeInfo)}, episode ${activeEpisodeNum}`,
      canonicalUrl: generateCanonicalUrl(`/watch/${animeId}?ep=${episodeId}`),
      ogImage: generateOGImage(animeInfo.poster),
      structured: generateAnimeStructuredData(animeInfo, { number: activeEpisodeNum, id: episodeId }),
      videoStructured: generateVideoStructuredData(animeInfo, { number: activeEpisodeNum, id: episodeId }, streamUrl),
      breadcrumb: generateBreadcrumbStructuredData([
        { name: 'Home', url: '/' },
        { name: animeInfo.title, url: `/${animeId}` },
        { name: `Episode ${activeEpisodeNum}`, url: `/watch/${animeId}?ep=${episodeId}` }
      ])
    };
  }, [animeId, animeInfo, activeEpisodeNum, episodeId, language, streamUrl]);

  const tags = useMemo(() => {
    const info = animeInfo?.animeInfo?.tvInfo;
    if (!info) return [];
    return [
      { condition: info.rating, text: info.rating, bgColor: "#ffffff" },
      { condition: info.quality, text: info.quality, bgColor: "#FFBADE" },
      { condition: info.sub, text: info.sub, icon: faClosedCaptioning, bgColor: "#B0E3AF" },
      { condition: info.dub, text: info.dub, icon: faMicrophone, bgColor: "#B9E7FF" },
    ];
  }, [animeInfo]);

  return (
    <>
      {seoData && (
        <Helmet>
          <title>{seoData.pageTitle}</title>
          <meta name="description" content={seoData.pageDescription} />
          <meta name="keywords" content={seoData.pageKeywords} />
          <link rel="canonical" href={seoData.canonicalUrl} />
          <meta property="og:title" content={seoData.pageTitle} />
          <meta property="og:description" content={seoData.pageDescription} />
          <meta property="og:image" content={seoData.ogImage} />
          <meta property="og:url" content={seoData.canonicalUrl} />
          <meta property="og:type" content="video.episode" />
          <meta name="twitter:card" content="summary_large_image" />
          <script type="application/ld+json">{JSON.stringify(seoData.structured)}</script>
          <script type="application/ld+json">{JSON.stringify(seoData.videoStructured)}</script>
          <script type="application/ld+json">{JSON.stringify(seoData.breadcrumb)}</script>
        </Helmet>
      )}

      <div className="w-full min-h-screen bg-[#0a0a0a]">
        <div className="w-full max-w-[1920px] mx-auto pt-20 pb-6 max-[1200px]:pt-16">
          <div className="grid grid-cols-[1fr_350px] items-start gap-6 w-full max-[1200px]:flex max-[1200px]:flex-col px-4 lg:px-6">

            {/* Left Column */}
            <div className="flex flex-col w-full gap-6">
              <div ref={playerRef} className="player w-full h-fit bg-black flex flex-col rounded-xl overflow-hidden shadow-2xl">
                <div ref={videoContainerRef} className="w-full relative aspect-video bg-black">
                  {!buffering ? (
                    <Player
                      streamUrl={streamUrl}
                      subtitles={subtitles}
                      intro={intro}
                      outro={outro}
                      activeServerName={activeServerName}
                      thumbnail={thumbnail}
                      autoSkipIntro={autoSkipIntro}
                      autoPlay={autoPlay}
                      autoNext={autoNext}
                      episodeId={episodeId}
                      episodes={episodes}
                      playNext={setEpisodeId}
                      animeInfo={animeInfo}
                      episodeNum={activeEpisodeNum}
                      streamInfo={streamInfo}
                    />
                  ) : (
                    <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
                      <BouncingLoader />
                    </div>
                  )}
                  <p className="text-center underline font-medium text-[15px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    {!buffering && !streamInfo ? (
                      servers ? (
                        <>
                          Probably this server is down, try other servers
                          <br />
                          Either reload or try again after sometime
                        </>
                      ) : (
                        <>
                          Probably streaming server is down
                          <br />
                          Either reload or try again after sometime
                        </>
                      )
                    ) : null}
                  </p>
                </div>

                <div className="bg-[#121212]">
                  {!buffering && (
                    <div>
                      <Watchcontrols
                        autoPlay={autoPlay} setAutoPlay={setAutoPlay}
                        autoSkipIntro={autoSkipIntro} setAutoSkipIntro={setAutoSkipIntro}
                        autoNext={autoNext} setAutoNext={setAutoNext}
                        episodes={episodes} totalEpisodes={totalEpisodes}
                        episodeId={episodeId} onButtonClick={setEpisodeId}
                      />
                    </div>
                  )}

                  <div className="px-3 py-2">
                    <Servers
                      servers={servers}
                      activeEpisodeNum={activeEpisodeNum}
                      activeServerId={activeServerId}
                      setActiveServerId={setActiveServerId}
                      serverLoading={serverLoading}
                      setActiveServerType={setActiveServerType}
                      activeServerType={activeServerType}
                      setActiveServerName={setActiveServerName}
                    />
                  </div>

                  {nextEpisodeSchedule?.nextEpisodeSchedule && showNextEpisodeSchedule && (
                    <div className="px-3 pb-3">
                      <div className="w-full p-3 rounded-lg bg-white/5 flex items-center justify-between border border-white/10">
                        <div className="flex items-center gap-x-3">
                          <span className="text-lg">🚀</span>
                          <div className="text-xs sm:text-sm">
                            <span className="text-gray-400">Next episode around: </span>
                            <span className="text-white font-medium">
                              {new Date(nextEpisodeSchedule.nextEpisodeSchedule).toLocaleString("en-GB", {
                                day: "2-digit", month: "2-digit", year: "numeric",
                                hour: "2-digit", minute: "2-digit", hour12: true
                              })}
                            </span>
                          </div>
                        </div>
                        <button onClick={() => setShowNextEpisodeSchedule(false)} className="text-2xl text-gray-500 hover:text-white transition-colors">×</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Section */}
              <div className="bg-[#141414] rounded-xl p-4 lg:p-6 shadow-lg border border-white/5">
                <div className="flex gap-4 sm:gap-6 flex-col sm:flex-row">
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    {animeInfo ? (
                      <img src={animeInfo.poster} alt={seoData?.safeTitle} className="w-[120px] aspect-[2/3] object-cover rounded-lg shadow-xl" />
                    ) : <Skeleton className="w-[120px] h-[180px] rounded-lg" />}
                  </div>
                  <div className="flex flex-col gap-3 flex-1 min-w-0">
                    {animeInfo ? (
                      <Link to={`/${animeId}`} className="group inline-block">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight group-hover:text-blue-400 transition-colors truncate">
                          {seoData?.safeTitle}
                        </h1>
                        <div className="flex items-center gap-1.5 mt-1 text-gray-400 text-xs sm:text-sm">
                          <span>View Details</span>
                          <FontAwesomeIcon icon={faPlay} className="text-[10px] transform group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </Link>
                    ) : <Skeleton className="w-48 h-8 rounded-lg" />}

                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {tags.map((tag, idx) => tag.condition && (
                        <InfoTag
                          key={idx}
                          icon={tag.icon}
                          text={tag.text}
                          className={tag.bgColor === "#ffffff" ? "bg-white/10" : ""}
                        />
                      ))}
                    </div>

                    {animeInfo?.animeInfo?.Overview && (
                      <div className="text-sm sm:text-base text-gray-300 leading-relaxed">
                        {animeInfo.animeInfo.Overview.length > 270 ? (
                          <>
                            {isFullOverview ? animeInfo.animeInfo.Overview : `${animeInfo.animeInfo.Overview.slice(0, 270)}...`}
                            <button onClick={() => setIsFullOverview(!isFullOverview)} className="ml-2 text-white font-medium hover:underline text-xs sm:text-sm">
                              {isFullOverview ? "Show Less" : "Read More"}
                            </button>
                          </>
                        ) : animeInfo.animeInfo.Overview}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Seasons (Mobile only) */}
              {seasons?.length > 0 && (
                <div className="hidden max-[1200px]:block bg-[#141414] rounded-xl p-4 shadow-lg border border-white/5">
                  <h2 className="text-lg font-bold mb-4 text-white">More Seasons</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {seasons.map((season, idx) => (
                      <Link
                        to={`/${season.id}`}
                        key={idx}
                        className={`relative aspect-[3/1] rounded-lg overflow-hidden group border-2 transition-all ${animeId === String(season.id) ? "border-white/40 shadow-lg" : "border-transparent"}`}
                      >
                        <img src={season.season_poster} alt={season.season} className={`w-full h-full object-cover scale-150 transition-opacity ${animeId === String(season.id) ? "opacity-60" : "opacity-40 group-hover:opacity-60"}`} />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10" />
                        <div className="absolute inset-0 flex items-center justify-center z-20 px-2">
                          <p className="text-xs font-bold text-white text-center line-clamp-2">{season.season}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (Desktop Only) */}
            <div className="flex flex-col gap-6 max-[1200px]:hidden">
              <div ref={episodesRef} className="episodes flex flex-col bg-[#141414] rounded-xl overflow-hidden shadow-lg border border-white/5">
                {!episodes ? (
                  <div className="flex-1 flex items-center justify-center min-h-[400px]">
                    <BouncingLoader /></div>
                ) : (
                  <Episodelist
                    episodes={episodes}
                    currentEpisode={episodeId}
                    onEpisodeClick={setEpisodeId}
                    totalEpisodes={totalEpisodes}
                  />
                )}
              </div>

              {!animeInfoLoading && animeInfo?.related_data?.length > 0 && (
                <div className="bg-[#141414] rounded-xl p-4 shadow-lg border border-white/5">
                  <h2 className="text-lg font-bold mb-4 text-white">Related Anime</h2>
                  <Sidecard data={animeInfo.related_data} className="!mt-0" />
                </div>
              )}
            </div>

            {/* Related Anime (Mobile only) */}
            {!animeInfoLoading && animeInfo?.related_data?.length > 0 && (
              <div className="hidden max-[1200px]:block bg-[#141414] rounded-xl p-4 shadow-lg border border-white/5">
                <h2 className="text-lg font-bold mb-4 text-white">Related Anime</h2>
                <Sidecard data={animeInfo.related_data} className="!mt-0" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
