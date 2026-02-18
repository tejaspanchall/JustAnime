import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/src/context/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import useToolTipPosition from "@/src/hooks/useToolTipPosition";
import Qtip from "../qtip/Qtip";
import getSafeTitle from "@/src/utils/getSafetitle";

function Topten({ data, className }) {
  const { language } = useLanguage();
  const [activePeriod, setActivePeriod] = useState("today");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const navigate = useNavigate();

  const handlePeriodChange = (period) => {
    setActivePeriod(period);
  };

  const handleNavigate = (id) => {
    navigate(`/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentData =
    activePeriod === "today"
      ? data.today
      : activePeriod === "week"
        ? data.week
        : data.month;

  const { tooltipPosition, tooltipHorizontalPosition, cardRefs } =
    useToolTipPosition(hoveredItem, currentData);

  const handleMouseEnter = (item, index) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setHoveredItem(item.id + index);
  };

  const handleMouseLeave = () => {
    setHoverTimeout(
      setTimeout(() => {
        setHoveredItem(null);
      }, 300) // Small delay to prevent flickering
    );
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div className="flex justify-between items-center max-[350px]:flex-col max-[350px]:gap-y-2 max-[350px]:items-start">
        <h1 className="font-bold text-2xl text-white tracking-tight">Top 10</h1>
        <ul className="flex justify-between w-fit bg-[#1a1a1a] rounded-lg overflow-hidden shadow-lg">
          {["today", "week", "month"].map((period) => (
            <li
              key={period}
              className={`cursor-pointer p-1.5 px-4 transition-all duration-200 ${activePeriod === period
                ? "bg-white text-black font-medium"
                : "text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                }`}
              onClick={() => handlePeriodChange(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col space-y-3 bg-[#1a1a1a] p-3 pt-6 rounded-lg shadow-lg">
        {currentData &&
          currentData.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-x-3 group"
              ref={(el) => (cardRefs.current[index] = el)}
            >
              <h1
                className={`font-bold text-2xl transition-colors ${index < 3
                  ? "text-white border-b-2 border-white pb-0.5"
                  : "text-gray-600"
                  } max-[350px]:hidden`}
              >
                {`${index + 1 < 10 ? "0" : ""}${index + 1}`}
              </h1>
              <div
                style={{
                  borderBottom:
                    index + 1 < 10
                      ? "1px solid rgba(255, 255, 255, .1)"
                      : "none",
                }}
                className="flex pb-3 relative container items-center group-hover:bg-[#2a2a2a] transition-colors duration-200 rounded-lg p-1.5"
              >
                <img
                  src={`${item.poster}`}
                  alt={getSafeTitle(item.title, language, item.japanese_title)}
                  className="w-[55px] h-[70px] rounded-lg object-cover flex-shrink-0 cursor-pointer shadow-md transition-transform duration-200 group-hover:scale-[1.02]"
                  onClick={() => navigate(`/watch/${item.id}`)}
                  onMouseEnter={() => handleMouseEnter(item, index)}
                  onMouseLeave={handleMouseLeave}
                />

                {/* Tooltip positioned near image */}
                {hoveredItem === item.id + index &&
                  window.innerWidth > 1024 && (
                    <div
                      className={`absolute ${tooltipPosition} ${tooltipHorizontalPosition} 
                      ${tooltipPosition === "top-1/2"
                          ? "translate-y-[50px]"
                          : "translate-y-[-50px]"
                        } 
                      z-[100000] transform transition-all duration-300 ease-in-out 
                      ${hoveredItem === item.id + index
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-2"
                        }`}
                      onMouseEnter={() => {
                        if (hoverTimeout) clearTimeout(hoverTimeout);
                      }}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Qtip id={item.id} />
                    </div>
                  )}

                <div className="flex flex-col ml-3 space-y-1.5">
                  <Link
                    to={`/${item.id}`}
                    className="text-[0.95em] font-medium text-gray-200 hover:text-white transform transition-all ease-out line-clamp-1 max-[478px]:line-clamp-2 max-[478px]:text-[14px]"
                    onClick={() => handleNavigate(item.id)}
                  >
                    {getSafeTitle(item.title, language, item.japanese_title)}
                  </Link>
                  <div className="flex flex-wrap items-center w-fit space-x-2 max-[350px]:gap-y-[3px]">
                    {item.tvInfo?.sub && (
                      <div className="flex space-x-1 justify-center items-center bg-white bg-opacity-10 backdrop-blur-sm rounded-md px-1.5 py-0.5 transition-colors duration-200 hover:bg-opacity-20">
                        <FontAwesomeIcon
                          icon={faClosedCaptioning}
                          className="text-[11px] text-gray-300"
                        />
                        <p className="text-[11px] font-medium text-gray-300">
                          {item.tvInfo.sub}
                        </p>
                      </div>
                    )}
                    {item.tvInfo?.dub && (
                      <div className="flex space-x-1 justify-center items-center bg-white bg-opacity-10 backdrop-blur-sm rounded-md px-1.5 py-0.5 transition-colors duration-200 hover:bg-opacity-20">
                        <FontAwesomeIcon
                          icon={faMicrophone}
                          className="text-[11px] text-gray-300"
                        />
                        <p className="text-[11px] font-medium text-gray-300">
                          {item.tvInfo.dub}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default React.memo(Topten);
