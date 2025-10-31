import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const Img = ({ src, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`relative ${className} m-2 rounded-md shadow-sm flex justify-center items-center `}
    >
      {!isLoaded && (
        <div
          className={`bg-gray-200 rounded animate-pulse aspect-w-1 aspect-h-1 flex justify-center items-center ${className}`}
        ></div>
      )}
      <LazyLoadImage
        className={`transition-opacity duration-500 rounded-md flex justify-center items-center  ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        alt=""
        effect="blur"
        src={src}
        afterLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

export default Img;
