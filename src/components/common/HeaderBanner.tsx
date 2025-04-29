"use client";
import { useState, useEffect } from 'react';

interface Image {
  src: string;
  // You can add more properties here if your images have them
  // e.g., alt?: string; id?: number; etc.
}

interface CarouselProps {
  images: Image[];
}

const Carousel = ({ images }: CarouselProps) => {
  const [current, setCurrent] = useState<number>(0);
  const length = images.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [length]);

  const nextSlide = () => setCurrent(current === length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? length - 1 : current - 1);

  if (!Array.isArray(images) || images.length <= 0) return null;

  return (
    <>
      <div className="container-fluid flex">
        <div className="header-banner flex-grow relative w-full h-full rounded-lg">
          {images.map((img, index) => (
            <div
              key={index}
              className={`${
                index === current ? 'block' : 'hidden'
              } duration-700 ease-in-out absolute top-0 left-0 w-full h-full`}
            >
              <img 
                src={img.src} 
                alt={`Slide ${index + 1}`} 
                className="w-full h-full object-cover" 
              />
            </div>
          ))}

          <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 gap-2 h-3 rounded-full ${index === current ? 'bg-blue-500' : 'bg-gray-300'}`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            className="absolute top-1/2 left-2 z-30 flex items-center justify-center w-10 h-10 cursor-pointer group focus:outline-none transform -translate-y-1/2"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
              &#8592;
            </span>
          </button>
          <button
            className="absolute top-1/2 right-2 z-30 flex items-center justify-center w-10 h-10 cursor-pointer group focus:outline-none transform -translate-y-1/2"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
              &#8594;
            </span>
          </button>
        </div>

        {/* Sidebar */}
        <div className=" sideBanner mx-3  text-white p-4 shadow-lg z-40 flex flex-col justify-center items-center">
          <h2 className="text-xl font-bold mb-4">Sidebar Content</h2>
          <p>This is your sidebar content. You can add anything here!</p>
        </div>
      </div>
    </>
  );
};

export default Carousel;