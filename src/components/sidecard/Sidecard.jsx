import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/src/context/LanguageContext";
import { Link } from "react-router-dom";
import useToolTipPosition from "@/src/hooks/useToolTipPosition";
import Qtip from "../qtip/Qtip";
import getSafeTitle from "@/src/utils/getSafetitle";

function Sidecard({ data, label, className }) {
  const { language } = useLanguage();
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const handleMouseEnter = (item, index) => {
    const timeout = setTimeout(() => {
      setHoveredItem(item.id + index);
    }, 400);
    setHoverTimeout(timeout);
  };
  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    setHoveredItem(null);
  };

  const [hoveredItem, setHoveredItem] = useState(null);
  const { tooltipPosition, tooltipHorizontalPosition, cardRefs } =
    useToolTipPosition(hoveredItem, data);

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <h2 className="font-medium text-lg text-neutral-200 mb-4">{label}</h2>
      )}
      <div className="flex flex-col space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-[#1a1a1a] scrollbar-thumb-[#2a2a2a] hover:scrollbar-thumb-[#333] scrollbar-thumb-rounded">
        {data &&
          data.map((item, index) => (
            <div
              key={index}
              className="group"
              ref={(el) => (cardRefs.current[index] = el)}
              onMouseEnter={() => handleMouseEnter(item, index)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to={`/${item.id}`}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="block"
              >
                <div className="flex items-start gap-3 p-2 rounded-lg transition-colors hover:bg-[#1f1f1f]">
                  {hoveredItem === item.id + index && window.innerWidth > 1024 && (
                    <div
                      className={`absolute ${tooltipPosition} ${tooltipHorizontalPosition} ${tooltipPosition === "top-1/2"
                        ? "translate-y-[50px]"
                        : "translate-y-[-50px]"
                        } z-[100000] transform transition-all duration-300 ease-in-out ${hoveredItem === item.id + index
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-2"
                        }`}
                    >
                      <Qtip id={item.id} />
                    </div>
                  )}
                  <img
                    src={`${item.poster}`}
                    alt={getSafeTitle(item.title, language, item.japanese_title)}
                    className="w-[50px] h-[70px] rounded object-cover"
                  />
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors line-clamp-1">
                      {getSafeTitle(item.title, language, item.japanese_title)}
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {item.tvInfo?.sub && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-[#2a2a2a] rounded text-gray-300">
                          <FontAwesomeIcon
                            icon={faClosedCaptioning}
                            className="text-[10px]"
                          />
                          <span className="text-[10px] font-medium">
                            {item.tvInfo.sub}
                          </span>
                        </div>
                      )}
                      {item.tvInfo?.dub && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-[#2a2a2a] rounded text-gray-300">
                          <FontAwesomeIcon
                            icon={faMicrophone}
                            className="text-[10px]"
                          />
                          <span className="text-[10px] font-medium">
                            {item.tvInfo.dub}
                          </span>
                        </div>
                      )}
                      {item.tvInfo?.showType && (
                        <span className="text-xs text-gray-400">
                          {item.tvInfo.showType}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}

export default React.memo(Sidecard);
