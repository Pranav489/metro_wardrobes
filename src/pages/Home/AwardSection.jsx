import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import {
//   awardImg1,
//   awardImg2,
//   awardImg3,
//   awardImg4,
//   awardImg5,
//   awardImg6,
//   awardVideo1,
//   awardVideo2,
// } from "../../../public/assets";

// const awardVideos = [
//   {
//     id: "video1",
//     title: "THE ACHIEVERS AWARDS SINGAPORE 2022",
//     description:
//       "Most Trusted Brand in French Doors & Windows Manufacturing of Maharashtra",
//     embedUrl: awardVideo1,
//     thumbnail: awardImg1,
//   },
//   {
//     id: "video2",
//     title: "THE ACHIEVERS AWARDS SINGAPORE 2022",
//     description:
//       "Most Trusted Brand in French Doors & Windows Manufacturing of Maharashtra",
//     embedUrl: awardVideo2,
//     thumbnail: awardImg2,
//   },
// ];

// const awardImages = [
//   {
//     title: "Global Impact Thailand 2023",
//     image: awardImg4,
//     year: "2023",
//   },

//   {
//     title: "THE ACHIEVERS AWARDS SINGAPORE 2022",
//     image: awardImg1,
//     year: "2022",
//   },
//   {
//     title: "Global Impact Thailand 2023",
//     image: awardImg3,
//     year: "2022",
//   },
//   {
//     title: "PRIDE OF NASHIK AWARDS",
//     image: awardImg6,
//     year: "2019",
//   },
// ];

const AwardSection = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [awards, setAwards] = useState({
    videoAwards: [],
    imageAwards: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const response = await axios.get('https://ishanib.demovoting.com/api/awards');
        if (response.data.success) {
          setAwards(response.data.data);
        } else {
          throw new Error('Failed to fetch awards');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, []);

   const nextVideo = () => {
    setCurrentVideo((prev) => (prev + 1) % awards.videoAwards.length);
    setIsPlaying(false);
  };

  const prevVideo = () => {
    setCurrentVideo(
      (prev) => (prev - 1 + awards.videoAwards.length) % awards.videoAwards.length
    );
    setIsPlaying(false);
  };

  const scroll = (dir) => {
    if (!carouselRef.current) return;
    const scrollAmount =
      dir === "left"
        ? carouselRef.current.scrollLeft - 250
        : carouselRef.current.scrollLeft + 250;
    carouselRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
  };

  if (loading) return <div className="text-center py-8">Loading awards...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (awards.videoAwards.length === 0 && awards.imageAwards.length === 0) {
    return <div className="text-center py-8">No awards found</div>;
  }

  return (
    <section className="bg-green-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-green-700 mb-2">
            Awards & Recognition
          </h2>
          <motion.div
            className="h-1 w-16 bg-green-600 mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: "4rem" }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
          <p className="text-lg text-green-700 max-w-3xl mx-auto">
            Our commitment to excellence has been recognized by industry leaders
            and satisfied customers alike.
          </p>
        </motion.div>

        {/* Video Showcase */}
        {awards.videoAwards.length > 0 && (
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-green-800 mb-6 text-center">
            Featured Awards
          </h3>

          <div className="relative bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
            {!isPlaying ? (
              <div className="relative">
                <img
                  src={`http://ishanib.demovoting.com/uploads/${awards.videoAwards[currentVideo].thumbnail}`}
                  alt={awards.videoAwards[currentVideo].title}
                  className="w-full h-auto max-h-[500px] object-fit"
                />
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="bg-green-600 bg-opacity-80 rounded-full p-4 hover:bg-opacity-100 transition-all">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            ) : (
              <div className="aspect-w-16 aspect-h-9">
                {awards.videoAwards[currentVideo].video_url ? (

                <iframe
                  src={`${awards.videoAwards[currentVideo].video_url}?autoplay=1`}
                  className="w-full h-[500px]"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={awards.videoAwards[currentVideo].title}
                />
                ) : (
                  <video
                    controls
                    autoPlay
                    className="w-full h-[500px]"
                    poster={`http://ishanib.demovoting.com/uploads/${awards.videoAwards[currentVideo].thumbnail}`}
                  >
                    <source
                      src={`http://ishanib.demovoting.com/uploads/${awards.videoAwards[currentVideo].video_file}`}
                      type="video/mp4"
                    />
                  </video>
                )}
              </div>
            )}

            <div className="p-6">
              <h4 className="text-xl font-bold text-green-900">
                {`${awards.videoAwards[currentVideo].title} ${awards.videoAwards[currentVideo].year}`}
              </h4>
              <p className="text-green-700 mt-2">
                 {awards.videoAwards[currentVideo].description}
              </p>
            </div>

            <button
              onClick={prevVideo}
              className="absolute left-5 top-1/2 -translate-y-1/2 z-20 bg-green-600/80 hover:bg-green-700 text-white p-3 rounded-full shadow"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextVideo}
              className="absolute right-5 top-1/2 -translate-y-1/2 z-20 bg-green-600/80 hover:bg-green-700 text-white p-3 rounded-full shadow"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        )}

        {/* Awards Carousel */}
        {awards.imageAwards.length > 0 && (
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-green-800 mb-8 text-center">
            Our Achievements
          </h3>

          <div className="relative">
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-[40%] transform -translate-y-1/2 z-10 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-md hidden md:block"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-[40%] transform -translate-y-1/2 z-10 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-md hidden md:block"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-4 px-2"
              ref={carouselRef}
            >
              {awards.imageAwards.map((award, index) => (
                <motion.div
                  key={award.id}
                  className="w-[300px] md:w-[400px] min-w-[400px] bg-white rounded-lg shadow-md overflow-hidden border border-green-100 hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="relative">
                    <img
                      src={`http://ishanib.demovoting.com/uploads/${award.image}`}
                      alt={award.title}
                      className="w-full h-96 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 bg-green-800 text-white px-3 py-1 text-sm font-medium">
                      {award.year}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-green-900 mb-2">
                      {award.title}
                    </h4>
                    <p className="text-green-700 text-sm">Ishani Enterprises</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* Recognition Text */}
        <div className="bg-green-600 rounded-xl p-8 text-center text-white max-w-4xl mx-auto">
          <motion.h3
            className="text-2xl font-bold mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Proudly Recognized for Excellence
          </motion.h3>
          <motion.p
            className="mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our awards reflect our commitment to quality, innovation, and
            customer satisfaction in the French door and window industry.
          </motion.p>
          {/* <motion.button
            className="bg-white text-green-800 px-6 py-2 rounded-lg font-medium hover:bg-green-100 transition-colors"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            View All Certifications
          </motion.button> */}
        </div>
      </div>
    </section>
  );
};

export default AwardSection;
