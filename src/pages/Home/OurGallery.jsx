import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const galleryImages = [
  "https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1618221716159-2a6ba1b25389?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1584395630827-860eee694d7b?auto=format&fit=crop&w=1400&q=80",
];

const clientImages = [
  {
    title: "Client One",
    image:
      "https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Client Two",
    image:
      "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Client Three",
    image:
      "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Client Four",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Client five",
    image:
      "https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Client six",
    image:
      "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Client seven",
    image:
      "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Client eight",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80",
  },
];

const IshaniIntro = () => {
  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-yellow-700"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Welcome to{" "}
          <span className="text-yellow-600 font-bold">Ishani Enterprises</span>
        </motion.h2>

        <motion.p
          className="mt-4 text-lg md:text-2xl font-medium text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          French Door & Window Manufacturers
        </motion.p>

        <motion.p
          className="italic text-gray-500 mt-2 text-base md:text-lg max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          “One such manufacturer is Ishani Enterprises, dedicated to creating
          premium French doors and windows that epitomize luxury and
          functionality.”
        </motion.p>

        <motion.div
          className="mt-6 text-gray-700 text-base md:text-lg max-w-4xl mx-auto"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <p className="mb-3">
            Our firm <strong>Ishani Enterprises</strong> got incorporated in the
            year <strong>2014</strong> and has been continuously growing with
            the support of our customers.
          </p>
          <p className="mb-3">
            We are a renowned manufacturer, supplier, trader, and service
            provider offering <strong>French Doors</strong>,{" "}
            <strong>French Windows</strong>, and{" "}
            <strong>maintenance services</strong> for safety doors.
          </p>
          <p className="mb-3">
            Our products are of the <strong>highest quality</strong> and{" "}
            <strong>easy to install</strong>. Our team of professionals crafts
            these entrances and glazing solutions using durable, top-grade
            materials.
          </p>
          <p className="mt-4 text-yellow-600 font-semibold">
            Trusted by Clients. Built for Durability & Elegance.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const OurGallery = () => {
  const [current, setCurrent] = useState(0);
  const carouselRef = useRef(null);

  const next = () => {
    setCurrent((prev) => (prev + 1) % galleryImages.length);
  };

  const prev = () => {
    setCurrent(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [current]);

  const scroll = (dir) => {
    if (!carouselRef.current) return;
    const scrollAmount =
      dir === "left"
        ? carouselRef.current.scrollLeft - 250
        : carouselRef.current.scrollLeft + 250;
    carouselRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <>
      <IshaniIntro />

      <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            className="text-3xl font-bold text-yellow-700 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Gallery
          </motion.h2>
          <motion.div
            className="h-1 w-16 bg-yellow-500 mx-auto mb-8"
            initial={{ width: 0 }}
            animate={{ width: "4rem" }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />

          <div className="relative w-full h-[400px] sm:h-[500px] overflow-hidden rounded-xl shadow-md">
            {galleryImages.map((img, index) => (
              <motion.img
                key={index}
                src={img}
                alt={`Gallery ${index + 1}`}
                className={`absolute top-0 left-0 w-full h-full  transition-opacity duration-1000 ${
                  index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: index === current ? 1 : 0 }}
              />
            ))}

            <button
              onClick={prev}
              className="absolute left-5 top-1/2 -translate-y-1/2 z-20 bg-yellow-500/70 hover:bg-yellow-500 text-white p-2 rounded-full shadow"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={next}
              className="absolute right-5 top-1/2 -translate-y-1/2 z-20 bg-yellow-500/70 hover:bg-yellow-500 text-white p-2 rounded-full shadow"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-10 relative">
            <h3 className="text-2xl font-semibold mb-6 text-yellow-700">
              Our Clients
            </h3>
            <div className="relative">
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-[40%] transform -translate-y-1/2 z-10 bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full shadow-md hidden md:block"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-[40%] transform -translate-y-1/2 z-10 bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full shadow-md hidden md:block"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-2 px-2"
                ref={carouselRef}
              >
                {clientImages.map((client, index) => (
                  <motion.div
                    key={index}
                    className="w-[180px] min-w-[180px] bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <img
                      src={client.image}
                      alt={client.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-2">
                      <h4 className="text-sm font-semibold text-gray-700">
                        {client.title}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OurGallery;
