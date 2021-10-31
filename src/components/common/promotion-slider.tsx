import { ArrowNext, ArrowPrev } from "@components/icons";
import SwiperCore, { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { useSettings } from "@contexts/settings.context";

import "swiper/swiper-bundle.css";
// dummy data

const offerSliderBreakpoints = {
  320: {
    slidesPerView: 1,
    spaceBetween: 0,
  },
  580: {
    slidesPerView: 2,
    spaceBetween: 16,
  },
  1024: {
    slidesPerView: 3,
    spaceBetween: 16,
  },
  1920: {
    slidesPerView: 4,
    spaceBetween: 24,
  },
};

SwiperCore.use([Navigation]);

export default function PromotionSlider() {

  const [data,setData] = useState([])

  useEffect(() => {

    fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}${API_ENDPOINTS.BANNER}`) 
    .then((resp) => resp.json())
    .then(function(data) {

      setData(data)
    });


 
  }, []);

  const settings = useSettings();
  return (
    
    <div className="px-6 py-5 md:px-8 xl:px-12 md:py-10 border-t border-gray-200" style={{display: `${settings?.site?.banner}`}}>
      <div className="relative">
        <Swiper 
          id="offer"
          loop={true}
          breakpoints={offerSliderBreakpoints}
          navigation={{
            nextEl: ".next",
            prevEl: ".prev",
          }}
        >
          {data?.map((d:any) => (
            <SwiperSlide key={d.id}>
              <a href={d.link} target={d.mode}>

                <div style={{background: `url(${d.image})`,backgroundSize:'cover',backgroundPosition:'center', width: '100%', height: '270px' }}></div>
             
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
        <div
          className="prev cursor-pointer absolute top-2/4 -left-4 md:-left-5 z-10 -mt-4 md:-mt-5 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white shadow-xl border border-gray-200 border-opacity-70 flex items-center justify-center text-gray-800 transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary"
          role="button"
        >
          <span className="sr-only">previous</span>
          <ArrowPrev width={18} height={18} />
        </div>
        <div
          className="next cursor-pointer absolute top-2/4 -right-4 md:-right-5 z-10 -mt-4 md:-mt-5 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white shadow-xl border border-gray-200 border-opacity-70 flex items-center justify-center text-gray-800 transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary"
          role="button"
        >
          <span className="sr-only">next</span>
          <ArrowNext width={18} height={18} />
        </div>
      </div>
    </div>
  );
}
