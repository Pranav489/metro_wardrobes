import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ChevronLeft, ChevronRight, Dot, Circle } from "lucide-react";

const GallerySection = () => {
  const [galleryImage, setGalleryImage] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const clientsRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [galleryResponse, testimonialsResponse] = await Promise.all([
          axios.get("https://ishanib.demovoting.com/api/gallery"),
          axios.get("https://ishanib.demovoting.com/api/testimonials/featured"),
        ]);
        // console.log(galleryResponse, testimonialsResponse);
        setGalleryImage(galleryResponse.data.data);
        setTestimonials(testimonialsResponse.data.data);
      } catch (error) {
        // console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  // Main gallery navigation
  const nextImage = () => {
    setDirection(1);
    setCurrentImage((prev) => (prev + 1) % galleryImage?.length);
    setIsAutoPlaying(true);
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentImage(
      (prev) => (prev - 1 + galleryImage.length) % galleryImage.length
    );
    setIsAutoPlaying(true);
  };

  const goToImage = (index) => {
    setDirection(index > currentImage ? 1 : -1);
    setCurrentImage(index);
    setIsAutoPlaying(true);
  };

  // Auto-play effect
  // useEffect(() => {
  //   if (!isAutoPlaying) return;
  //   const timer = setTimeout(nextImage, 5000);
  //   return () => clearTimeout(timer);
  // }, [currentImage, isAutoPlaying]);

  // Client testimonials carousel scroll
  const scrollClients = (direction) => {
    if (clientsRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      clientsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      transition: { duration: 0.3 },
    }),
  };

  return (
    <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Gallery Section */}
        <div className="mb-20">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center text-green-700 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Work Gallery
          </motion.h2>

          <motion.div
            className="h-1 w-16 bg-green-500 mx-auto mb-12"
            initial={{ width: 0 }}
            animate={{ width: "4rem" }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />

          <div
            className="relative h-[500px] sm:h-[600px] rounded-2xl overflow-hidden shadow-xl"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                key={currentImage}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={`https://ishanib.demovoting.com/uploads/${galleryImage[currentImage].src}`}
                  alt={galleryImage[currentImage].alt}
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <motion.p
                    className="text-white text-lg font-medium"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {galleryImage[currentImage].category}
                  </motion.p>
                  <motion.h3
                    className="text-white text-2xl font-bold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {/* {galleryImage[currentImage].alt} */}
                  </motion.h3>
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={prevImage}
              className="absolute left-5 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-green-700 p-3 rounded-full shadow-lg transition-all hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-5 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-green-700 p-3 rounded-full shadow-lg transition-all hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {galleryImage.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`p-1 rounded-full transition-all ${
                    currentImage === index
                      ? "text-green-500"
                      : "text-white/50 hover:text-white"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                >
                  {currentImage === index ? (
                    <Circle className="w-3 h-3 fill-current" />
                  ) : (
                    <Dot className="w-3 h-3" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Client Testimonials */}
        <div className="mt-28">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center text-green-700 mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            What Our Clients Say
          </motion.h2>

          <motion.div
            className="h-1 w-16 bg-green-500 mx-auto mb-12"
            initial={{ width: 0 }}
            whileInView={{ width: "4rem" }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true }}
          />

          <div className="relative">
            <button
              onClick={() => scrollClients("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-md hidden md:block transition-transform hover:scale-110"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scrollClients("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-md hidden md:block transition-transform hover:scale-110"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div
              ref={clientsRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-4 px-2"
            >
              {testimonials.map((client, index) => (
                <motion.div
                  key={index}
                  className="min-w-[300px] sm:min-w-[350px] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={`https://ishanib.demovoting.com/uploads/${client.image}`}
                        alt={client.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-gray-800">
                          {client.name}
                        </h4>
                        <p className="text-sm text-green-600">
                          {client.project}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic mb-4">
                      "{client.quote}"
                    </p>
                    <div className="flex gap-1 text-green-500">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < client.rating ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                              />
                            </svg>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
