import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Spotlight.css";
import Banner from "../banner/Banner";

const Spotlight = ({ spotlights }) => {
  return (
    <>
      <div className="relative h-[450px] max-[1390px]:h-[400px] max-[1300px]:h-[350px] max-md:h-[300px] pt-[20px]">
        {spotlights && spotlights.length > 0 ? (
          <>
            <Swiper
              spaceBetween={0}
              slidesPerView={1}
              loop={true}
              allowTouchMove={true}
              grabCursor={true}
              navigation={{
                nextEl: ".button-next",
                prevEl: ".button-prev",
              }}
              pagination={{
                clickable: true,
                dynamicBullets: false,
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              modules={[Navigation, Autoplay, Pagination]}
              className="h-[450px] max-[1390px]:h-full rounded-md overflow-hidden relative"
              style={{
                "--swiper-pagination-bullet-inactive-color": "rgba(255, 255, 255, 0.5)",
                "--swiper-pagination-bullet-inactive-opacity": "1",
              }}
            >
              <div className="absolute right-[20px] top-[20px] flex space-x-1.5 z-[5]">
                <div className="button-prev"></div>
                <div className="button-next"></div>
              </div>
              {spotlights.map((item, index) => (
                <SwiperSlide className="text-black relative" key={index}>
                  <Banner item={item} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        ) : (
          <p>No spotlights to show.</p>
        )}
      </div>
    </>
  );
};

export default Spotlight;