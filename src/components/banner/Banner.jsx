import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faClosedCaptioning,
  faMicrophone,
  faCalendar,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useLanguage } from "@/src/context/LanguageContext";
import getSafeTitle from "@/src/utils/getSafetitle";
import "./Banner.css";

function Banner({ item, index }) {
  const { language } = useLanguage();
  return (
    <section className="spotlight w-full h-full relative rounded-md overflow-hidden">
      <img
        src={`${item.poster}`}
        alt={getSafeTitle(item.title, language, item.japanese_title)}
        className="absolute inset-0 object-cover w-full h-full rounded-md"
        draggable="false"
      />
      <div className="spotlight-overlay absolute inset-0 z-[1] rounded-md"></div>

      <div className="absolute flex flex-col left-0 bottom-[40px] w-[55%] p-4 z-[2] max-[1390px]:w-[45%] max-[1390px]:bottom-[40px] max-[1300px]:w-[600px] max-[1120px]:w-[60%] max-md:w-[90%] max-md:bottom-[20px] max-[300px]:w-full">
        <p className="text-[#ffbade] font-semibold text-[20px] w-fit max-[1300px]:text-[15px]">
          #{index + 1} Spotlight
        </p>
        <h3 className="text-white line-clamp-2 text-5xl font-bold mt-4 text-left max-[1390px]:text-[45px] max-[1300px]:text-3xl max-[1300px]:mt-3 max-md:text-2xl max-md:mt-1 max-[575px]:text-[22px] max-sm:leading-6 max-sm:w-[80%] max-[320px]:w-full">
          {getSafeTitle(item.title, language, item.japanese_title)}
        </h3>

        {/* Mobile Buttons */}
        <div className="hidden max-md:flex max-md:mt-3 max-md:gap-x-3 max-md:w-full">
          <Link
            to={`/watch/${item.id}`}
            className="bg-white/90 hover:bg-white text-black font-medium px-5 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-x-2 text-sm"
          >
            <FontAwesomeIcon
              icon={faPlay}
              className="text-[10px]"
            />
            <span>Watch Now</span>
          </Link>
          <Link
            to={`/${item.id}`}
            className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium px-5 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-x-2 text-sm"
          >
            <span>Details</span>
          </Link>
        </div>

        <div className="flex h-fit justify-start items-center w-fit space-x-5 mt-5 max-[1300px]:mt-4 max-md:hidden">
          {item.tvInfo && (
            <>
              {item.tvInfo.showType && (
                <div className="flex space-x-1 justify-center items-center">
                  <FontAwesomeIcon
                    icon={faPlay}
                    className="text-[8px] bg-white/10 text-white px-[4px] py-[3px] rounded-full"
                  />
                  <p className="text-white/70 text-[16px]">
                    {item.tvInfo.showType}
                  </p>
                </div>
              )}

              {item.tvInfo.duration && (
                <div className="flex space-x-1 justify-center items-center">
                  <FontAwesomeIcon
                    icon={faClock}
                    className="text-white/70 text-[14px]"
                  />
                  <p className="text-white/70 text-[17px]">
                    {item.tvInfo.duration}
                  </p>
                </div>
              )}

              {item.tvInfo.releaseDate && (
                <div className="flex space-x-1 justify-center items-center">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="text-white/70 text-[14px]"
                  />
                  <p className="text-white/70 text-[16px]">
                    {item.tvInfo.releaseDate}
                  </p>
                </div>
              )}

              <div className="flex space-x-3 w-fit">
                {item.tvInfo.quality && (
                  <div className="bg-white/10 py-[1px] px-[6px] rounded-md w-fit text-[11px] font-bold h-fit text-white">
                    {item.tvInfo.quality}
                  </div>
                )}
                <div className="flex space-x-[1px] rounded-r-[5px] rounded-l-[5px] w-fit py-[1px] overflow-hidden">
                  {item.tvInfo.episodeInfo?.sub && (
                    <div className="flex space-x-1 justify-center items-center bg-white/10 px-[4px]">
                      <FontAwesomeIcon
                        icon={faClosedCaptioning}
                        className="text-[12px] text-white"
                      />
                      <p className="text-[12px] font-bold text-white">
                        {item.tvInfo.episodeInfo.sub}
                      </p>
                    </div>
                  )}

                  {item.tvInfo.episodeInfo?.dub && (
                    <div className="flex space-x-1 justify-center items-center bg-white/20 px-[4px]">
                      <FontAwesomeIcon
                        icon={faMicrophone}
                        className="text-[12px] text-white"
                      />
                      <p className="text-[12px] font-semibold text-white">
                        {item.tvInfo.episodeInfo.dub}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <p className="text-white/70 text-[17px] font-sm mt-4 text-left line-clamp-3 max-[1200px]:line-clamp-2 max-[1300px]:w-[500px] max-[1120px]:w-[90%] max-md:hidden">
          {item.description}
        </p>
      </div>
      {/* Desktop Buttons */}
      <div className="absolute bottom-[50px] right-[40px] flex gap-x-5 z-[2] max-md:hidden">
        <Link
          to={`/watch/${item.id}`}
          className="bg-white/90 hover:bg-white text-black font-medium px-7 py-2 rounded-lg transition-all duration-200 flex items-center gap-x-2.5 shadow-lg shadow-black/10 backdrop-blur-sm hover:translate-y-[-1px]"
        >
          <FontAwesomeIcon
            icon={faPlay}
            className="text-[10px]"
          />
          <span>Watch Now</span>
        </Link>
        <Link
          to={`/${item.id}`}
          className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium px-7 py-2 rounded-lg transition-all duration-200 flex items-center gap-x-2.5 backdrop-blur-sm hover:translate-y-[-1px]"
        >
          <span>Details</span>
        </Link>
      </div>
    </section>
  );
}

export default Banner;