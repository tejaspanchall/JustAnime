import getAnimeInfo from "@/src/utils/getAnimeInfo.utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import website_name from "@/src/config/website";
import CategoryCard from "@/src/components/categorycard/CategoryCard";
import Sidecard from "@/src/components/sidecard/Sidecard";
import Loader from "@/src/components/Loader/Loader";
import Error from "@/src/components/error/Error";
import { useLanguage } from "@/src/context/LanguageContext";
import { useHomeInfo } from "@/src/context/HomeInfoContext";
import Voiceactor from "@/src/components/voiceactor/Voiceactor";
import getSafeTitle from "@/src/utils/getSafetitle";

function InfoItem({ label, value, isProducer = true }) {
  return (
    value && (
      <div className="text-[11px] sm:text-[14px] font-medium transition-all duration-300">
        <span className="text-gray-400">{`${label}: `}</span>
        <span className="font-light text-white/90">
          {Array.isArray(value) ? (
            value.map((item, index) =>
              isProducer ? (
                <Link
                  to={`/producer/${item
                    .replace(/[&'"^%$#@!()+=<>:;,.?/\\|{}[\]`~*_]/g, "")
                    .split(" ")
                    .join("-")
                    .replace(/-+/g, "-")}`}
                  key={index}
                  className="cursor-pointer transition-colors duration-300 hover:text-gray-300"
                >
                  {item}
                  {index < value.length - 1 && ", "}
                </Link>
              ) : (
                <span key={index}>
                  {item}
                  {index < value.length - 1 && ", "}
                </span>
              )
            )
          ) : isProducer ? (
            <Link
              to={`/producer/${value
                .replace(/[&'"^%$#@!()+=<>:;,.?/\\|{}[\]`~*_]/g, "")
                .split(" ")
                .join("-")
                .replace(/-+/g, "-")}`}
              className="cursor-pointer transition-colors duration-300 hover:text-gray-300"
            >
              {value}
            </Link>
          ) : (
            <span>{value}</span>
          )}
        </span>
      </div>
    )
  );
}

function Tag({ bgColor, index, icon, text }) {
  return (
    <div
      className="flex space-x-1 justify-center items-center px-2 sm:px-3 py-0.5 sm:py-1 text-white backdrop-blur-md bg-white/10 font-medium text-[10px] sm:text-[13px] rounded-md sm:rounded-full transition-all duration-300 hover:bg-white/20"
    >
      {icon && <FontAwesomeIcon icon={icon} className="text-[10px] sm:text-[12px] mr-1" />}
      <p className="text-[10px] sm:text-[12px]">{text}</p>
    </div>
  );
}

function AnimeInfo({ random = false }) {
  const { language } = useLanguage();
  const { id: paramId } = useParams();
  const id = random ? null : paramId;
  const [isFull, setIsFull] = useState(false);
  const [animeInfo, setAnimeInfo] = useState(null);
  const [seasons, setSeasons] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { homeInfo } = useHomeInfo();
  const { id: currentId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (id === "404-not-found-page") {
      console.log("404 got!");
      return null;
    } else {
      const fetchAnimeInfo = async () => {
        setLoading(true);
        try {
          const data = await getAnimeInfo(id, random);
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
    }
  }, [id, random]);
  useEffect(() => {
    if (animeInfo && location.pathname === `/${animeInfo.id}`) {
      const safeTitle = getSafeTitle(animeInfo.title, language, animeInfo.japanese_title);
      document.title = `Watch ${safeTitle} English Sub/Dub online Free on ${website_name}`;
    }
    return () => {
      document.title = `${website_name} | Free anime streaming platform`;
    };
  }, [animeInfo, language]);
  if (loading) return <Loader type="animeInfo" />;
  if (error) {
    return <Error />;
  }
  if (!animeInfo) {
    navigate("/404-not-found-page");
    return undefined;
  }
  const { title, japanese_title, poster, animeInfo: info } = animeInfo;
  const safeTitle = getSafeTitle(title, language, japanese_title);

  const tags = [
    {
      condition: info.tvInfo?.rating,
      bgColor: "#ffffff",
      text: info.tvInfo.rating,
    },
    {
      condition: info.tvInfo?.quality,
      bgColor: "#FFBADE",
      text: info.tvInfo.quality,
    },
    {
      condition: info.tvInfo?.sub,
      icon: faClosedCaptioning,
      bgColor: "#B0E3AF",
      text: info.tvInfo.sub,
    },
    {
      condition: info.tvInfo?.dub,
      icon: faMicrophone,
      bgColor: "#B9E7FF",
      text: info.tvInfo.dub,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="relative w-full overflow-hidden mt-[74px] max-md:mt-[60px]">

        {/* Main Content */}
        <div className="relative z-10 container mx-auto py-4 sm:py-6 lg:py-12">
          {/* Mobile Layout */}
          <div className="block md:hidden">
            <div className="flex flex-row gap-4">
              {/* Poster Section */}
              <div className="flex-shrink-0">
                <div className="relative w-[130px] xs:w-[150px] aspect-[2/3] rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                  <img
                    src={`${poster}`}
                    alt={`${safeTitle} Poster`}
                    className="w-full h-full object-cover"
                  />
                  {animeInfo.adultContent && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-500/90 backdrop-blur-sm rounded-md text-[10px] font-medium">
                      18+
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Info Section */}
              <div className="flex-1 min-w-0 space-y-2">
                {/* Title */}
                <div className="space-y-0.5">
                  <h1 className="text-lg xs:text-xl font-bold tracking-tight truncate">
                    {safeTitle}
                  </h1>
                  {language === "EN" && japanese_title && (
                    <p className="text-white/50 text-[11px] xs:text-xs truncate">JP Title: {japanese_title}</p>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(({ condition, icon, text }, index) =>
                    condition && (
                      <Tag
                        key={index}
                        index={index}
                        icon={icon}
                        text={text}
                      />
                    )
                  )}
                </div>

                {/* Overview - Limited for mobile */}
                {info?.Overview && (
                  <div className="text-gray-300 leading-relaxed text-xs">
                    {info.Overview.length > 150 ? (
                      <>
                        {isFull ? (
                          info.Overview
                        ) : (
                          <div className="line-clamp-3">{info.Overview}</div>
                        )}
                        <button
                          className="mt-1 text-white/70 hover:text-white transition-colors text-[10px] font-medium"
                          onClick={() => setIsFull(!isFull)}
                        >
                          {isFull ? "Show Less" : "Read More"}
                        </button>
                      </>
                    ) : (
                      info.Overview
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Watch Button - Full Width on Mobile */}
            <div className="mt-6">
              {animeInfo?.animeInfo?.Status?.toLowerCase() !== "not-yet-aired" ? (
                <Link
                  to={`/watch/${animeInfo.id}`}
                  className="flex justify-center items-center w-full px-4 py-3 bg-white/10 backdrop-blur-md rounded-lg text-white transition-all duration-300 hover:bg-white/20 group"
                >
                  <FontAwesomeIcon
                    icon={faPlay}
                    className="mr-2 text-xs group-hover:text-white"
                  />
                  <span className="font-medium text-sm">Watch Now</span>
                </Link>
              ) : (
                <div className="flex justify-center items-center w-full px-4 py-3 bg-gray-700/50 rounded-lg">
                  <span className="font-medium text-sm">Not released</span>
                </div>
              )}
            </div>

            {/* Details Section - Full Width on Mobile */}
            <div className="mt-6 space-y-3 py-3 backdrop-blur-md bg-white/5 rounded-lg px-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Japanese", value: info?.Japanese },
                  { label: "Synonyms", value: info?.Synonyms },
                  { label: "Aired", value: info?.Aired },
                  { label: "Premiered", value: info?.Premiered },
                  { label: "Duration", value: info?.Duration },
                  { label: "Status", value: info?.Status },
                  { label: "MAL Score", value: info?.["MAL Score"] },
                ].map((item, index) => (
                  <InfoItem
                    key={index}
                    label={item.label}
                    value={item.value}
                    isProducer={false}
                  />
                ))}
              </div>

              {/* Genres */}
              {info?.Genres && (
                <div className="pt-2 border-t border-white/10">
                  <p className="text-gray-400 text-xs mb-1.5">Genres</p>
                  <div className="flex flex-wrap gap-1">
                    {info.Genres.map((genre, index) => (
                      <Link
                        to={`/genre/${genre.split(" ").join("-")}`}
                        key={index}
                        className="px-2 py-0.5 text-[10px] bg-white/5 rounded-md hover:bg-white/10 transition-colors"
                      >
                        {genre}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Studios & Producers */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                {[
                  { label: "Studios", value: info?.Studios },
                  { label: "Producers", value: info?.Producers },
                ].map((item, index) => (
                  <InfoItem
                    key={index}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Layout - Existing Code */}
          <div className="hidden md:block">
            <div className="flex flex-row gap-6 lg:gap-10">
              {/* Poster Section */}
              <div className="flex-shrink-0">
                <div className="relative w-[220px] lg:w-[260px] aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                  <img
                    src={`${poster}`}
                    alt={`${safeTitle} Poster`}
                    className="w-full h-full object-cover"
                  />
                  {animeInfo.adultContent && (
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 bg-red-500/90 backdrop-blur-sm rounded-lg text-xs font-medium">
                      18+
                    </div>
                  )}
                </div>
              </div>

              {/* Info Section */}
              <div className="flex-1 space-y-4 lg:space-y-5 min-w-0">
                {/* Title */}
                <div className="space-y-1">
                  <h1 className="text-3xl lg:text-4xl font-bold tracking-tight truncate">
                    {safeTitle}
                  </h1>
                  {language === "EN" && japanese_title && (
                    <p className="text-white/50 text-sm lg:text-base truncate">JP Title: {japanese_title}</p>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {tags.map(({ condition, icon, text }, index) =>
                    condition && (
                      <Tag
                        key={index}
                        index={index}
                        icon={icon}
                        text={text}
                      />
                    )
                  )}
                </div>

                {/* Overview */}
                {info?.Overview && (
                  <div className="text-gray-300 leading-relaxed max-w-3xl text-sm lg:text-base">
                    {info.Overview.length > 270 ? (
                      <>
                        {isFull
                          ? info.Overview
                          : `${info.Overview.slice(0, 270)}...`}
                        <button
                          className="ml-2 text-white/70 hover:text-white transition-colors text-sm font-medium"
                          onClick={() => setIsFull(!isFull)}
                        >
                          {isFull ? "Show Less" : "Read More"}
                        </button>
                      </>
                    ) : (
                      info.Overview
                    )}
                  </div>
                )}

                {/* Watch Button */}
                {animeInfo?.animeInfo?.Status?.toLowerCase() !== "not-yet-aired" ? (
                  <Link
                    to={`/watch/${animeInfo.id}`}
                    className="inline-flex items-center px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-xl text-white transition-all duration-300 hover:bg-white/20 hover:scale-[1.02] group"
                  >
                    <FontAwesomeIcon
                      icon={faPlay}
                      className="mr-2 text-sm group-hover:text-white"
                    />
                    <span className="font-medium">Watch Now</span>
                  </Link>
                ) : (
                  <div className="inline-flex items-center px-5 py-2.5 bg-gray-700/50 rounded-xl">
                    <span className="font-medium">Not released</span>
                  </div>
                )}

                {/* Details Section */}
                <div className="space-y-4 py-4 backdrop-blur-md bg-white/5 rounded-xl px-5">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Japanese", value: info?.Japanese },
                      { label: "Synonyms", value: info?.Synonyms },
                      { label: "Aired", value: info?.Aired },
                      { label: "Premiered", value: info?.Premiered },
                      { label: "Duration", value: info?.Duration },
                      { label: "Status", value: info?.Status },
                      { label: "MAL Score", value: info?.["MAL Score"] },
                    ].map((item, index) => (
                      <InfoItem
                        key={index}
                        label={item.label}
                        value={item.value}
                        isProducer={false}
                      />
                    ))}
                  </div>

                  {/* Genres */}
                  {info?.Genres && (
                    <div className="pt-3 border-t border-white/10">
                      <p className="text-gray-400 text-sm mb-2">Genres</p>
                      <div className="flex flex-wrap gap-1.5">
                        {info.Genres.map((genre, index) => (
                          <Link
                            to={`/genre/${genre.split(" ").join("-")}`}
                            key={index}
                            className="px-3 py-1 text-xs bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            {genre}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Studios & Producers */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    {[
                      { label: "Studios", value: info?.Studios },
                      { label: "Producers", value: info?.Producers },
                    ].map((item, index) => (
                      <InfoItem
                        key={index}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seasons Section */}
      {seasons?.length > 0 && (
        <div className="container mx-auto py-8 sm:py-12">
          <h2 className="text-2xl font-bold mb-6 sm:mb-8 px-1">More Seasons</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {seasons.map((season, index) => (
              <Link
                to={`/${season.id}`}
                key={index}
                className={`relative w-full aspect-[3/1] sm:aspect-[3/1] rounded-lg overflow-hidden cursor-pointer group ${currentId === String(season.id)
                    ? "ring-2 ring-white/40 shadow-lg shadow-white/10"
                    : ""
                  }`}
              >
                <img
                  src={season.season_poster}
                  alt={season.season}
                  className={`w-full h-full object-cover scale-150 ${currentId === String(season.id)
                      ? "opacity-50"
                      : "opacity-40"
                    }`}
                />
                {/* Dots Pattern Overlay */}
                <div
                  className="absolute inset-0 z-10"
                  style={{
                    backgroundImage: `url('data:image/svg+xml,<svg width="3" height="3" viewBox="0 0 3 3" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="1.5" cy="1.5" r="0.5" fill="white" fill-opacity="0.25"/></svg>')`,
                    backgroundSize: '3px 3px'
                  }}
                />
                {/* Dark Gradient Overlay */}
                <div className={`absolute inset-0 z-20 bg-gradient-to-r ${currentId === String(season.id)
                    ? "from-black/50 to-transparent"
                    : "from-black/40 to-transparent"
                  }`} />
                {/* Title Container */}
                <div className="absolute inset-0 z-30 flex items-center justify-center">
                  <p className={`text-[14px] sm:text-[16px] md:text-[18px] font-bold text-center px-2 sm:px-4 transition-colors duration-300 ${currentId === String(season.id)
                      ? "text-white"
                      : "text-white/90 group-hover:text-white"
                    }`}>
                    {season.season}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Voice Actors Section */}
      {animeInfo?.charactersVoiceActors.length > 0 && (
        <div className="container mx-auto py-12">
          <Voiceactor animeInfo={animeInfo} />
        </div>
      )}

      {/* Recommendations Section */}
      {animeInfo.recommended_data.length > 0 && (
        <div className="container mx-auto py-12">
          <CategoryCard
            label="Recommended for you"
            data={animeInfo.recommended_data}
            limit={animeInfo.recommended_data.length}
            showViewMore={false}
          />
        </div>
      )}
    </div>
  );
}

export default AnimeInfo;
