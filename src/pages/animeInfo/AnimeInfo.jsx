import getAnimeInfo from "@/src/utils/getAnimeInfo.utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CategoryCard from "@/src/components/categorycard/CategoryCard";
import Loader from "@/src/components/Loader/Loader";
import Error from "@/src/components/error/Error";
import { useLanguage } from "@/src/context/LanguageContext";
import Voiceactor from "@/src/components/voiceactor/Voiceactor";
import getSafeTitle from "@/src/utils/getSafetitle";
import { Helmet } from 'react-helmet-async';
import InfoTag from "@/src/components/ui/InfoTag/InfoTag";
import {
  generateDescription,
  generateKeywords,
  generateCanonicalUrl,
  generateOGImage,
  generateAnimeStructuredData,
  generateBreadcrumbStructuredData,
  optimizeTitle,
} from '@/src/utils/seo.utils';

const InfoItem = ({ label, value, isProducer = true }) => {
  if (!value) return null;

  const renderValue = () => {
    if (Array.isArray(value)) {
      return value.map((item, index) => (
        <span key={index}>
          {isProducer ? (
            <Link
              to={`/producer/${item.replace(/[&'"^%$#@!()+=<>:;,.?/\\|{}[\]`~*_]/g, "").split(" ").join("-").replace(/-+/g, "-")}`}
              className="cursor-pointer transition-colors duration-300 hover:text-gray-300"
            >
              {item}
            </Link>
          ) : (
            item
          )}
          {index < value.length - 1 && ", "}
        </span>
      ));
    }

    if (isProducer) {
      return (
        <Link
          to={`/producer/${value.replace(/[&'"^%$#@!()+=<>:;,.?/\\|{}[\]`~*_]/g, "").split(" ").join("-").replace(/-+/g, "-")}`}
          className="cursor-pointer transition-colors duration-300 hover:text-gray-300"
        >
          {value}
        </Link>
      );
    }

    return value;
  };

  return (
    <div className="text-[11px] sm:text-[14px] font-medium transition-all duration-300">
      <span className="text-gray-400">{`${label}: `}</span>
      <span className="font-light text-white/90">{renderValue()}</span>
    </div>
  );
};

const Synopsis = ({ text, isFull, onToggle, isMobile = false }) => {
  if (!text) return null;
  const limit = isMobile ? 150 : 270;
  const isTooLong = text.length > limit;

  return (
    <div className={`${isMobile ? 'text-xs' : 'text-sm lg:text-base'} text-gray-300 leading-relaxed max-w-3xl`}>
      {isTooLong ? (
        <>
          {isFull ? text : (isMobile ? <div className="line-clamp-3">{text}</div> : `${text.slice(0, limit)}...`)}
          <button
            className="ml-2 text-white/70 hover:text-white transition-colors text-xs font-medium"
            onClick={onToggle}
          >
            {isFull ? "Show Less" : "Read More"}
          </button>
        </>
      ) : text}
    </div>
  );
};

const TagsList = ({ tags }) => (
  <div className="flex flex-wrap gap-1.5 sm:gap-2">
    {tags.map((tag, index) => tag.condition && (
      <InfoTag
        key={index}
        icon={tag.icon}
        text={tag.text}
        className={tag.bgColor === "#ffffff" ? "bg-white/10" : ""}
      />
    ))}
  </div>
);

const DetailGrid = ({ info, isMobile = false }) => {
  const items = [
    { label: "Japanese", value: info?.Japanese },
    { label: "Synonyms", value: info?.Synonyms },
    { label: "Aired", value: info?.Aired },
    { label: "Premiered", value: info?.Premiered },
    { label: "Duration", value: info?.Duration },
    { label: "Status", value: info?.Status },
    { label: "MAL Score", value: info?.["MAL Score"] },
  ];

  return (
    <div className={`grid grid-cols-2 gap-2 sm:gap-3 py-3 sm:py-4 px-3 sm:px-5 backdrop-blur-md bg-white/5 rounded-lg sm:rounded-xl ${isMobile ? 'text-xs' : ''}`}>
      {items.map((item, index) => (
        <InfoItem key={index} label={item.label} value={item.value} isProducer={false} />
      ))}

      {info?.Genres && (
        <div className="col-span-2 pt-2 sm:pt-3 border-t border-white/10">
          <p className="text-gray-400 text-xs sm:text-sm mb-1.5 sm:mb-2">Genres</p>
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {info.Genres.map((genre, index) => (
              <Link
                to={`/genre/${genre.split(" ").join("-")}`}
                key={index}
                className="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs bg-white/5 rounded-md sm:rounded-lg hover:bg-white/10 transition-colors"
              >
                {genre}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="col-span-2 space-y-2 sm:space-y-3 pt-2 sm:pt-3 border-t border-white/10">
        <InfoItem label="Studios" value={info?.Studios} />
        <InfoItem label="Producers" value={info?.Producers} />
      </div>
    </div>
  );
};

function AnimeInfo({ random = false }) {
  const { language } = useLanguage();
  const { id: paramId } = useParams();
  const id = random ? null : paramId;
  const { id: currentId } = useParams();
  const navigate = useNavigate();

  const [isFull, setIsFull] = useState(false);
  const [animeInfo, setAnimeInfo] = useState(null);
  const [seasons, setSeasons] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id === "404-not-found-page") return;

    const fetchAnimeInfo = async () => {
      setLoading(true);
      try {
        const data = await getAnimeInfo(id, random);
        if (!data?.data) throw new Error("Anime not found");
        setSeasons(data?.seasons);
        setAnimeInfo(data.data);
      } catch (err) {
        console.error("Error fetching anime info:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimeInfo();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id, random]);

  const seoData = useMemo(() => {
    if (!animeInfo) return null;
    const { title, japanese_title, poster, animeInfo: info } = animeInfo;
    const safeTitle = getSafeTitle(title, language, japanese_title);
    return {
      safeTitle,
      title: optimizeTitle(`Watch ${safeTitle} Sub Dub Online Free`),
      description: generateDescription(info?.Overview),
      keywords: generateKeywords(animeInfo),
      canonical: generateCanonicalUrl(`/${animeInfo.id}`),
      ogImage: generateOGImage(poster),
      structured: generateAnimeStructuredData(animeInfo),
      breadcrumb: generateBreadcrumbStructuredData([
        { name: 'Home', url: '/' },
        { name: animeInfo.title, url: `/${animeInfo.id}` }
      ])
    };
  }, [animeInfo, language]);

  const tags = useMemo(() => {
    if (!animeInfo?.animeInfo?.tvInfo) return [];
    const info = animeInfo.animeInfo;
    return [
      { condition: info.tvInfo.rating, text: info.tvInfo.rating, bgColor: "#ffffff" },
      { condition: info.tvInfo.quality, text: info.tvInfo.quality, bgColor: "#FFBADE" },
      { condition: info.tvInfo.sub, text: info.tvInfo.sub, icon: faClosedCaptioning, bgColor: "#B0E3AF" },
      { condition: info.tvInfo.dub, text: info.tvInfo.dub, icon: faMicrophone, bgColor: "#B9E7FF" },
    ];
  }, [animeInfo]);

  if (loading) return <Loader type="animeInfo" />;
  if (error || (!animeInfo && !loading)) return <Error />;
  if (!animeInfo) {
    navigate("/404-not-found-page");
    return null;
  }

  const { poster, japanese_title, animeInfo: info } = animeInfo;
  const isAiring = animeInfo?.animeInfo?.Status?.toLowerCase() !== "not-yet-aired";

  return (
    <>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <link rel="canonical" href={seoData.canonical} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content={seoData.ogImage} />
        <meta property="og:url" content={seoData.canonical} />
        <meta property="og:type" content="video.tv_show" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.ogImage} />
        <script type="application/ld+json">{JSON.stringify(seoData.structured)}</script>
        <script type="application/ld+json">{JSON.stringify(seoData.breadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="relative w-full overflow-hidden mt-[64px] max-md:mt-[50px]">
          <div className="relative z-10 container mx-auto py-4 sm:py-6 lg:pt-4 lg:pb-8">

            {/* Mobile Layout */}
            <div className="block md:hidden pt-4">
              <div className="flex flex-row gap-4">
                <div className="flex-shrink-0">
                  <div className="relative w-[130px] xs:w-[150px] aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                    <img src={poster} alt={seoData.safeTitle} className="w-full h-full object-cover" />
                    {animeInfo.adultContent && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-500/90 backdrop-blur-sm rounded-md text-[10px] font-medium">18+</div>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="space-y-0.5">
                    <h1 className="text-lg xs:text-xl font-bold tracking-tight truncate">{seoData.safeTitle}</h1>
                    {language === "EN" && japanese_title && (
                      <p className="text-white/50 text-[11px] xs:text-xs truncate">JP: {japanese_title}</p>
                    )}
                  </div>
                  <TagsList tags={tags} />
                  <Synopsis text={info?.Overview} isFull={isFull} onToggle={() => setIsFull(!isFull)} isMobile />
                </div>
              </div>

              <div className="mt-6">
                {isAiring ? (
                  <Link to={`/watch/${animeInfo.id}`} className="flex justify-center items-center w-full px-4 py-3 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-all group">
                    <FontAwesomeIcon icon={faPlay} className="mr-2 text-xs group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-sm">Watch Now</span>
                  </Link>
                ) : (
                  <div className="flex justify-center items-center w-full px-4 py-3 bg-gray-700/50 rounded-lg text-gray-400">
                    <span className="font-medium text-sm">Not yet released</span>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <DetailGrid info={info} isMobile />
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block">
              <div className="flex flex-row gap-6 lg:gap-10">
                <div className="flex-shrink-0">
                  <div className="relative w-[220px] lg:w-[260px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl">
                    <img src={poster} alt={seoData.safeTitle} className="w-full h-full object-cover" />
                    {animeInfo.adultContent && (
                      <div className="absolute top-3 left-3 px-2.5 py-0.5 bg-red-500/90 backdrop-blur-sm rounded-lg text-xs font-medium">18+</div>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-4 lg:space-y-5 min-w-0">
                  <div className="space-y-1">
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight truncate">{seoData.safeTitle}</h1>
                    {language === "EN" && japanese_title && (
                      <p className="text-white/50 text-sm lg:text-base truncate">JP Title: {japanese_title}</p>
                    )}
                  </div>

                  <TagsList tags={tags} />
                  <Synopsis text={info?.Overview} isFull={isFull} onToggle={() => setIsFull(!isFull)} />

                  {isAiring ? (
                    <Link to={`/watch/${animeInfo.id}`} className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 hover:scale-[1.02] transition-all group">
                      <FontAwesomeIcon icon={faPlay} className="mr-2 text-sm group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Watch Now</span>
                    </Link>
                  ) : (
                    <div className="inline-flex items-center px-6 py-3 bg-gray-700/50 rounded-xl text-gray-400">
                      <span className="font-medium">Not yet released</span>
                    </div>
                  )}

                  <DetailGrid info={info} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="container mx-auto space-y-8 pb-12">
          {seasons?.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 px-1">More Seasons</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {seasons.map((season, index) => (
                  <Link
                    to={`/${season.id}`}
                    key={index}
                    className={`relative w-full aspect-[3/1] rounded-lg overflow-hidden group border-2 transition-all ${currentId === String(season.id) ? "border-white/40 shadow-lg" : "border-transparent"}`}
                  >
                    <img src={season.season_poster} alt={season.season} className={`w-full h-full object-cover scale-150 transition-opacity ${currentId === String(season.id) ? "opacity-50" : "opacity-40 group-hover:opacity-60"}`} />
                    <div
                      className="absolute inset-0 z-10"
                      style={{
                        backgroundImage: `url('data:image/svg+xml,<svg width="3" height="3" viewBox="0 0 3 3" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="1.5" cy="1.5" r="0.5" fill="white" fill-opacity="0.25"/></svg>')`,
                        backgroundSize: '3px 3px'
                      }}
                    />
                    <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/60 to-transparent" />
                    <div className="absolute inset-0 z-30 flex items-center justify-center">
                      <p className="text-sm sm:text-base font-bold text-center px-4">{season.season}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {animeInfo?.charactersVoiceActors?.length > 0 && (
            <div className="pt-4">
              <Voiceactor animeInfo={animeInfo} />
            </div>
          )}

          {animeInfo?.recommended_data?.length > 0 && (
            <div className="pt-4">
              <CategoryCard
                label="Recommended for you"
                data={animeInfo.recommended_data}
                limit={animeInfo.recommended_data.length}
                showViewMore={false}
                gridClass="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AnimeInfo;
