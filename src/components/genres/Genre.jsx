import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

function Genre({ data }) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Instant scroll on mount without animation
  useEffect(() => {
    if (scrollContainerRef.current) {
      // Direct manipulation of scrollLeft for instant scroll
      scrollContainerRef.current.scrollLeft = 300;
    }
  }, []);

  return (
    <div className="relative pt-2 max-sm:pt-[15px]">
      <div className="relative flex items-center min-h-[32px] max-sm:min-h-[28px]">
        {/* Content first for proper stacking */}
        <div
          ref={scrollContainerRef}
          className="absolute inset-0 overflow-x-auto no-scrollbar scroll-smooth"
          style={{
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}
        >
          <div className="flex gap-2 h-8 max-sm:h-7 items-center min-w-max px-24 max-sm:px-16">
            {data && data.map((item, index) => (
              <Link
                to={`/genre/${item}`}
                key={index}
                className="px-3.5 max-sm:px-3 h-8 max-sm:h-7 flex items-center bg-[#1a1a1a] hover:bg-[#252525] rounded-[4px] transition-all duration-300 ease-in-out group"
              >
                <div className="text-white font-medium whitespace-nowrap text-[13px] max-sm:text-xs tracking-wide group-hover:text-white/90 transition-colors duration-300">
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Left button and gradient */}
        <div className="relative z-20 flex items-center">
          <button
            onClick={() => scroll('left')}
            className="bg-[#1a1a1a] hover:bg-[#252525] h-8 max-sm:h-7 w-8 max-sm:w-7 flex items-center justify-center rounded-[4px] transition-all duration-300 ease-in-out focus:outline-none active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 max-sm:h-3.5 w-4 max-sm:w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="h-8 max-sm:h-7 w-20 max-sm:w-12 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent max-sm:from-[#0a0a0a]/60 max-sm:via-[#0a0a0a]/40 pointer-events-none"></div>
        </div>

        {/* Spacer for content */}
        <div className="flex-1"></div>

        {/* Right button and gradient */}
        <div className="relative z-20 flex items-center">
          <div className="h-8 max-sm:h-7 w-20 max-sm:w-12 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent max-sm:from-[#0a0a0a]/60 max-sm:via-[#0a0a0a]/40 pointer-events-none"></div>
          <button
            onClick={() => scroll('right')}
            className="bg-[#1a1a1a] hover:bg-[#252525] h-8 max-sm:h-7 w-8 max-sm:w-7 flex items-center justify-center rounded-[4px] transition-all duration-300 ease-in-out focus:outline-none active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 max-sm:h-3.5 w-4 max-sm:w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Genre);
