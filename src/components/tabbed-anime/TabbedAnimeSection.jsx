import { useState } from "react";
import PropTypes from "prop-types";
import CategoryCard from "@/src/components/categorycard/CategoryCard.jsx";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

function TabbedAnimeSection({ topAiring, mostFavorite, latestCompleted, className = "", limit = 10 }) {
  const [activeTab, setActiveTab] = useState("airing");

  const tabs = [
    { id: "airing", label: "Top Airing", data: topAiring, path: "top-airing" },
    { id: "favorite", label: "Most Favorite", data: mostFavorite, path: "most-favorite" },
    { id: "completed", label: "Latest Completed", data: latestCompleted, path: "completed" },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center border-b border-[#ffffff1a] relative">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-4 text-[15px] font-medium transition-all duration-300 
                ${activeTab === tab.id
                  ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary after:rounded-t-full"
                  : "text-[#ffffff80] hover:text-white"
                }
                before:absolute before:bottom-0 before:left-1/2 before:w-0 before:h-[2px] before:bg-[#ffffff40]
                before:transition-all before:duration-300 before:-translate-x-1/2
                hover:before:w-full
                group
              `}
            >
              <span className="relative z-10 transition-transform duration-300 group-hover:transform group-hover:translate-y-[-1px]">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
        <Link
          to={`/${activeTabData.path}`}
          className="flex items-center gap-x-1 py-1 px-2 -mr-2 rounded-md
            text-[13px] font-medium text-[#ffffff80] hover:text-white
            transition-all duration-300 group"
        >
          View all
          <FaChevronRight className="text-[10px] transform transition-transform duration-300 
            group-hover:translate-x-0.5" />
        </Link>
      </div>

      <CategoryCard
        data={activeTabData.data}
        path={activeTabData.path}
        limit={limit}
        showViewMore={false}
        cardStyle="grid-cols-5 max-[1400px]:grid-cols-4 max-[758px]:grid-cols-3 max-[478px]:grid-cols-3"
      />
    </div>
  );
}

TabbedAnimeSection.propTypes = {
  topAiring: PropTypes.array.isRequired,
  mostFavorite: PropTypes.array.isRequired,
  latestCompleted: PropTypes.array.isRequired,
  className: PropTypes.string,
};

export default TabbedAnimeSection; 