import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FaHistory, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useLanguage } from "@/src/context/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import getSafeTitle from "@/src/utils/getSafetitle";

const ContinueWatching = () => {
  const [watchList, setWatchList] = useState([]);
  const { language } = useLanguage();
  const swiperRef = useRef(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("continueWatching") || "[]");
    setWatchList(data.reverse());
  }, []);

  const removeFromWatchList = (episodeId) => {
    setWatchList((prevList) => {
      const updatedList = prevList.filter(
        (item) => item.episodeId !== episodeId
      );
      localStorage.setItem("continueWatching", JSON.stringify([...updatedList].reverse()));
      return updatedList;
    });
  };

  if (watchList.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between max-md:pl-4 mb-3">
        <div className="flex items-center gap-x-3 justify-center">
          <FaHistory className="text-gray-200 text-xl" />
          <h1 className="text-gray-200 text-2xl font-bold tracking-tight max-[450px]:text-xl max-[450px]:mb-1 max-[350px]:text-lg">
            Continue Watching
          </h1>
        </div>

        <div className="flex gap-x-3 pr-2 max-[350px]:hidden">
          <button className="continue-btn-prev bg-gray-800 text-gray-300 p-3 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300 shadow-lg">
            <FaChevronLeft className="text-sm" />
          </button>
          <button className="continue-btn-next bg-gray-800 text-gray-300 p-3 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300 shadow-lg">
            <FaChevronRight className="text-sm" />
          </button>
        </div>
      </div>

      <div className="relative mx-auto overflow-hidden z-[1]">
        <Swiper
          ref={swiperRef}
          className="w-full h-full"
          slidesPerView={3}
          spaceBetween={20}
          breakpoints={{
            640: { slidesPerView: 4, spaceBetween: 20 },
            768: { slidesPerView: 4, spaceBetween: 20 },
            1024: { slidesPerView: 5, spaceBetween: 24 },
            1300: { slidesPerView: 6, spaceBetween: 24 },
            1600: { slidesPerView: 7, spaceBetween: 28 },
          }}
          modules={[Navigation]}
          navigation={{
            nextEl: ".continue-btn-next",
            prevEl: ".continue-btn-prev",
          }}
        >
          {watchList.map((item, index) => (
            <SwiperSlide
              key={index}
              className="text-center flex justify-center items-center"
            >
              <div className="w-full h-auto pb-[140%] relative inline-block overflow-hidden rounded-lg shadow-lg group">
                <button
                  className="absolute top-3 right-3 bg-black/70 text-gray-300 w-8 h-8 flex items-center justify-center rounded-lg text-sm z-10 font-medium hover:bg-white hover:text-black transition-all duration-300"
                  onClick={() => removeFromWatchList(item.episodeId)}
                >
                  ✖
                </button>

                <Link
                  to={`/watch/${item?.id}?ep=${item.episodeId}`}
                  className="inline-block bg-gray-900 absolute left-0 top-0 w-full h-full group"
                >
                  <img
                    src={`${item?.poster}`}
                    alt={getSafeTitle(item?.title, language, item?.japanese_title)}
                    className="block w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:blur-sm"
                    title={getSafeTitle(item?.title, language, item?.japanese_title)}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <FontAwesomeIcon
                        icon={faPlay}
                        className="text-[50px] text-white drop-shadow-lg max-[450px]:text-[36px]"
                      />
                    </div>
                  </div>
                </Link>
                {item?.adultContent === true && (
                  <div className="text-white px-2 py-0.5 rounded-lg bg-red-600 absolute top-3 left-3 flex items-center justify-center text-[12px] font-bold">
                    18+
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3 pb-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                  <p className="text-white text-[15px] font-bold text-left truncate mb-1.5 max-[450px]:text-sm drop-shadow-lg">
                    {getSafeTitle(item?.title, language, item?.japanese_title)}
                  </p>
                  <p className="text-gray-200 text-[13px] font-semibold text-left max-[450px]:text-[12px] drop-shadow-md">
                    Episode {item.episodeNum}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ContinueWatching;
