import getSearchSuggestion from "@/src/utils/getSearchSuggestion.utils";
import { useEffect, useState } from "react";
import BouncingLoader from "../ui/bouncingloader/Bouncingloader";
import { FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import getSafeTitle from "@/src/utils/getSafetitle";
import { useLanguage } from "@/src/context/LanguageContext";

function Suggestion({ keyword, className, onSuggestionClick }) {
  const { language } = useLanguage();
  const [suggestion, setSuggestion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchSearchSuggestion = async () => {
      if (!keyword) return;
      setLoading(true);
      setHasFetched(false);
      try {
        const data = await getSearchSuggestion(keyword);
        setSuggestion(data);
        setHasFetched(true);
      } catch (err) {
        console.error("Error fetching search suggestion info:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchSuggestion();
  }, [keyword]);

  return (
    <div
      className={`bg-zinc-900 ${className} flex ${loading ? "justify-center py-4" : "justify-start"
        } ${!suggestion ? "p-2" : "justify-start"} items-center rounded-lg`}
      style={{
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.05)"
      }}
    >
      {loading ? (
        <BouncingLoader />
      ) : error && !suggestion ? (
        <div className="text-gray-400 p-3">Error loading suggestions</div>
      ) : suggestion && hasFetched ? (
        <div className="w-full flex flex-col pt-1 overflow-y-auto">
          {suggestion.map((item, index) => (
            <Link
              to={`/${item.id}`}
              key={index}
              onClick={onSuggestionClick}
              className="group py-2 flex items-start gap-x-3 hover:bg-zinc-800 transition-all duration-200 cursor-pointer px-3"
              style={{
                borderBottom:
                  index === suggestion.length - 1
                    ? "none"
                    : "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <img
                src={`${item.poster}`}
                className="w-[45px] h-[65px] flex-shrink-0 object-cover rounded-md shadow-lg"
                alt={getSafeTitle(item.title, language, item.japanese_title)}
                onError={(e) => {
                  e.target.src = "https://i.postimg.cc/HnHKvHpz/no-avatar.jpg";
                }}
              />
              <div className="flex flex-col gap-y-[2px]">
                {(item?.title || item?.japanese_title) && (
                  <h1 className="line-clamp-1 leading-5 font-semibold text-[14px] text-gray-100 group-hover:text-white">
                    {getSafeTitle(item.title, language, item.japanese_title)}
                  </h1>
                )}
                {(item?.releaseDate || item?.showType || item?.duration) && (
                  <div className="flex gap-x-2 items-center w-full justify-start mt-[2px]">
                    <p className="leading-4 text-[12px] font-normal text-gray-400">
                      {item.releaseDate || "N/A"}
                    </p>
                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                    <p className="leading-4 text-[12px] font-medium text-gray-300 group-hover:text-white">
                      {item.showType || "N/A"}
                    </p>
                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                    <p className="leading-4 text-[12px] font-normal text-gray-400">
                      {item.duration || "N/A"}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          ))}
          {!loading && hasFetched && (
            <Link
              className="w-full flex py-2.5 justify-center items-center bg-zinc-800 hover:bg-zinc-700 transition-all duration-200 rounded-b-lg"
              to={`/search?keyword=${encodeURIComponent(keyword)}`}
              onClick={onSuggestionClick}
            >
              <div className="flex w-fit items-center gap-x-2">
                <p className="text-[14px] font-medium text-gray-200">
                  View all results
                </p>
                <FaChevronRight className="text-gray-200 text-[11px] mt-[1px]" />
              </div>
            </Link>
          )}
        </div>
      ) : hasFetched ? (
        <p className="text-gray-300 p-3">No results found!</p>
      ) : null}
    </div>
  );
}

export default Suggestion;
