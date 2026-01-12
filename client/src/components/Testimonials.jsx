import React from "react";
import { useSelector } from "react-redux";
import TestimonialCarousel from "./cards/TestimonialCarousel";
import { testimonials } from "../utils";

const Testimonials = () => {
  const theme = useSelector((state) => state.theme.value);
  return (
    <div
    id="testimonials"
      className={` ${
        theme === "dark" && "bg-zinc-900 text-white"
      } w-full bg-gradient-to-r from-zinc-900/30 flex flex-col `}
    >
      <p className="text-3xl max-lg:text-xl font-semibold p-4 md:px-24">
        Success stories.
      </p>
      <div className="testimonialContainer py-8 w-fit">
        <TestimonialCarousel autoSlide autoSlideInterval={10000}>
          {testimonials.map((testimonial, i) => {
            return (
              <div
                key={i}
                className="flex flex-col items-center md:px-24 gap-4 rounded-lg w-screen"
              >
                <div className="flex justify-start items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-20 h-20 rounded-full"
                  />
                  <p className="text-lg font-semibold">{testimonial.name}</p>
                </div>
                <p className="w-full text-center max-lg:px-8 italic tracking-wide text-gray-300 font-extralight">"{testimonial.quote}"</p>
              </div>
            );
          })}
        </TestimonialCarousel>
      </div>
    </div>
  );
};

export default Testimonials;
