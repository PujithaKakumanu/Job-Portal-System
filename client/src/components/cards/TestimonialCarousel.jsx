import { useState, useEffect } from "react";

export default function TestimonialCard({
  children,
  autoSlide = false,
  autoSlideInterval = 3000,
}) {
  const [curr, setCurr] = useState(0);

  const next = () =>
    setCurr((curr) => (curr === children.length - 1 ? 0 : curr + 1));

  useEffect(() => {
    if (!autoSlide) return;
    const slideInterval = setInterval(next, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, []);
  return (
    <div className="overflow-hidden relative shadow-[0_0_20px_gray] shadow-gray-300/40 py-8 bg-slate-900/90 text-white">
      <div
        className="flex transition-transform ease-out duration-500 py-8 border-t border-b"
        style={{ transform: `translateX(-${curr * 100}vw)` }}
      >
       {children}
      </div>
      
      <div className="absolute bottom-2 right-0 left-0 w-screen">
        <div className="flex items-center justify-center gap-2">
          {children.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurr(i)}
              className={`
              transition-all w-2 h-2 bg-white cursor-pointer rounded-full duration-300
              ${curr === i ? "p-1 w-6 bg-gray-300/60" : "bg-opacity-50"}
            `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

