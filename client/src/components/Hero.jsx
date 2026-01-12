import React from "react";
import CountUp from "react-countup";
import { carouselImages,  tags } from "../utils";
import Carousel from "./cards/Carousel";
import { animateHover, removeHover } from "../utils/services";
import { Link } from "react-router-dom";
import Searchbar from "./shared/Searchbar";
import { useSelector } from "react-redux";

const Hero = () => {

  const theme = useSelector((state) => state.theme.value);

  return (
    <div
    id="home"
      className="page1 bg-gradient-to-r from-transparent to-slate-900/30 items-center w-full flex max-lg:flex-col gap-6"
    >
      <div className="heroLeft h-full flex flex-col items-center justify-center w-1/2 max-lg:w-full">
        <div
          className="relative flex leftContent items-start justify-center flex-col md:w-3/4 px-4 gap-4 max-lg:mt-[10vh]"
          onMouseMove={(e) => animateHover(e)}
          onMouseLeave={() => removeHover()}
        >
          <h1 className="z-[12] welcome" id="welcome">
            Welcome to Jobster
          </h1>
          <div
            className="absolute h-1/3 overlayGif md:w-1/2 w-full inset-0 z-[11] scale-75"
            id="image"
          >
            <img
              src={"./images/hoverGif.gif"}
              className="overlayGifImg absolute md:w-[30vw] h-[40vh] max-lg:scale-50 max-lg:-ml-20 max-lg:-mt-20 -mt-12 max-lg:aspect-square opacity-75  rounded-full"
            />
          </div>
          <div
            id="heading"
            className="heading text-6xl max-lg:text-3xl font-bold stroke md:mix-blend-difference z-[12]"
          >
            Find the Perfect Job for You.
          </div>
          <p className="desc text-sm max-lg:text-xs z-[12]">
            Search your career opportunities through{" "}
            <CountUp end={28000} duration={5} suffix="+" /> jobs
          </p>

          <Searchbar />

          <p className="">Popular Searches</p>
          <div className="flex flex-wrap gap-2 space-y-1 text-xs">
            {tags.map((tag, index) => {
              return (
                <Link
                  to={`dashboard/search?jobTitle=${tag}`}
                  key={index}
                  className={`flex items-center rounded-xl px-2 py-[1px] z-[12] border ${
                    theme === "dark"
                      ? "bg-slate-900/90 hover:bg-gray-800"
                      : "bg-gray-300 hover:bg-gray-500"
                  } cursor-pointer`}
                >
                  {tag}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="heroRight w-1/2 max-lg:w-full h-1/2 md:min-h-screen flex items-center justify-center max-lg:pb-6 max-lg:px-4">
        <div className="cards w-3/4 max-sm:w-full aspect-square relative flex items-center justify-center ">
          <Carousel autoSlide autoSlideInterval={5000}>
            {carouselImages.map((image, index) => (
              <img src={image} key={index} priority='true' className="scale-75"/>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Hero;
