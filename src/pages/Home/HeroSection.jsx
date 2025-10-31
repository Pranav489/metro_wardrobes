import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Calendar,
  DoorOpen,
} from "lucide-react";
import axiosInstance from "../../services/api";

const HeroSection = () => {
  const [heroContent, setHeroContent] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes] = await Promise.all([
          axiosInstance.get("/herocontent"),
        ]);
        setHeroContent(heroRes.data || []);
      } catch (err) {
        // console.error("Error fetching data:", err);
        setError("Failed to load content. Please try again later.");
        setHeroContent([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || heroContent.length === 0) return;
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, heroContent]);

  const nextImage = () => {
    if (heroContent.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % heroContent.length);
  };

  const prevImage = () => {
    if (heroContent.length === 0) return;
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + heroContent.length) % heroContent.length
    );
  };

  if (loading) {
    return (
      <div className="h-[600px] md:h-[700px] flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <motion.div
            className="flex justify-center mb-6"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 2,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"></div>
          </motion.div>
          <motion.h2
            className="text-2xl font-semibold text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Loading...
          </motion.h2>
          <motion.p
            className="text-gray-500 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Preparing your experience
          </motion.p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[600px] flex items-center justify-center text-gray-500">
        {error}
      </div>
    );
  }

  if (heroContent.length === 0) {
    return (
      <div className="h-[600px] flex items-center justify-center text-gray-500">
        No hero content available
      </div>
    );
  }

  const currentItem = heroContent[currentIndex] || {};

  const { image_url, title, description, ctaHighlight } = currentItem;

  return (
    <>
      {/* Hero Section */}
      <div
        className="relative w-full h-[600px] md:h-[700px] flex items-center justify-center text-white overflow-hidden shadow-xl"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Background Image */}
        {image_url && (
          <motion.div
            className="absolute  inset-0 h-full bg-cover md:bg-cover bg-center"
            style={{
              backgroundImage: `url(http://127.0.0.1:8000/uploads/${image_url})`,
            }}
            key={image_url}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 bg-black/20"></div>
          </motion.div>
        )}

        {/* Navigation Arrows */}
        {heroContent.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="hidden md:flex absolute left-4 md:left-10 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full z-10 backdrop-blur-sm transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="text-white w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="hidden md:flex absolute right-4 md:right-10 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full z-10 backdrop-blur-sm transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="text-white w-6 h-6" />
            </button>
          </>
        )}

        {/* Text Content */}
        <motion.div
          className="relative z-10 flex flex-col justify-center items-center max-w-4xl mx-auto px-4"
          key={title || "default"}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {ctaHighlight && (
            <motion.div
              className="inline-block bg-green-500 text-white px-4 py-2 rounded-full mb-4 text-sm font-medium"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {ctaHighlight}
            </motion.div>
          )}
          <h1 className="text-3xl md:text-center sm:text-5xl lg:text-6xl font-bold mb-4">
            {title || "Welcome to Ishani Enterprises"}
          </h1>
          {description && (
            <p className="mt-4 text-center text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </motion.div>

        {/* Indicators */}
        {heroContent.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {heroContent.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentIndex === index ? "bg-green-500 w-6" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="relative z-20 -mt-20 px-4 w-full">
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 mx-auto w-full max-w-6xl border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Ishani Enterprises
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Maharashtra's premier French door and window specialists since
                2012
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  navigate(`/products`);
                }}
                className="flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-semibold w-full"
              >
                <DoorOpen className="w-5 h-5" />
                Explore Doors
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  navigate(`/contactus`);
                }}
                className="flex items-center justify-center gap-2 bg-white border border-green-500 text-green-500 px-6 py-3 rounded-lg hover:bg-green-50 transition font-semibold w-full"
              >
                <Calendar className="w-5 h-5" />
                Book a Visit
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default HeroSection;
