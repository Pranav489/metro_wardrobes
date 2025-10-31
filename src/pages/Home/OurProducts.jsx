import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFilter,
  FiChevronDown,
  FiX,
  FiPlay,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";

const OurProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get("https://ishanib.demovoting.com/api/products"),
          axios.get("https://ishanib.demovoting.com/api/productcategories"),
        ]);

        setProducts(productsRes.data.data || []);
        setCategories(categoriesRes.data.data || []);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle URL parameter for product ID
  useEffect(() => {
    const productId = searchParams.get("product");
    if (productId && products.length > 0) {
      const product = products.find((p) => p.id.toString() === productId);
      if (product) {
        setSelectedProduct(product);
        setActiveMediaIndex(0); // Reset to first media when opening a new product
      }
    }
  }, [searchParams, products]);

  const categoryMap = categories.reduce((acc, category) => {
    acc[category.name] = {
      icon: category.icon,
      descriptor: category.product_descriptor,
    };
    return acc;
  }, {});

  const filteredProducts =
    activeFilter === "All"
      ? products
      : products.filter((product) => product.category?.name === activeFilter);

  const handleProductClick = (product, e) => {
    if (e.target.closest("button")) return;
    setSelectedProduct(product);
    setActiveMediaIndex(0); // Reset to first media when opening a product
    navigate(`?product=${product.id}`, { replace: true });
  };

  const closeModal = () => {
    setSelectedProduct(null);
    navigate("", { replace: true });
  };

  // Get all media items for a product
  // Updated getProductMedia function to handle additional images
  const getProductMedia = (product) => {
    const media = [];

    // 1. Add features images first (if they exist)
    if (Array.isArray(product?.features)) {
      product.features.forEach((feature) => {
        if (feature?.image && typeof feature.image === 'string' && feature.image.trim()) {
          media.push({
            type: 'image',
            src: `https://ishanib.demovoting.com/uploads/${feature.image.trim()}`,
            alt: feature?.alt || `${product.title || 'Product'} feature`
          });
        }
      });
    }

    // 2. Add main image if exists
    if (product?.image && typeof product.image === 'string' && product.image.trim()) {
      media.unshift({  // Add at beginning to prioritize main image
        type: 'image',
        src: `https://ishanib.demovoting.com/uploads/${product.image.trim()}`,
        alt: product?.image_alt || product?.title || 'Main product image'
      });
    }

    // 3. Add videos if they exist
    if (product?.videos) {
      const videoArray = Array.isArray(product.videos) ? product.videos : [product.videos];
      videoArray.forEach(videoPath => {
        if (videoPath && typeof videoPath === 'string' && videoPath.trim()) {
          media.push({
            type: 'video',
            src: `https://ishanib.demovoting.com/uploads/${videoPath.trim()}`,
            alt: `${product?.title || 'Product'} video`
          });
        }
      });
    }

    return media;
  };

  // Updated Product Card in the grid
  const renderProductCard = (product) => {
    const hasMainImage = product?.image && typeof product.image === 'string' && product.image.trim();
    const hasVideos = product?.videos && Array.isArray(product.videos) ?
      product.videos.some(v => v && typeof v === 'string' && v.trim()) :
      typeof product.videos === 'string' && product.videos.trim();
    const hasAdditionalImages = Array.isArray(product?.features) &&
      product.features.some(f => f?.image && typeof f.image === 'string' && f.image.trim());
    const firstImage = hasMainImage ? product.image :
      (hasAdditionalImages ? product.features.find(f => f?.image)?.image : null);

    return (
      <motion.div
        key={product.id}
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0 },
        }}
        whileHover={{
          y: -5,
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
        }}
        className="bg-white rounded-xl overflow-hidden border border-gray-100 transition-all cursor-pointer"
        onClick={(e) => handleProductClick(product, e)}
      >
        <div className="relative h-48 overflow-hidden">
          {hasMainImage ? (
            <img
              src={`https://ishanib.demovoting.com/uploads/${product.image}`}
              alt={product.image_alt || product.title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '';
                e.target.parentElement.innerHTML = hasVideos ? videoPlaceholder() :
                  hasAdditionalImages ? additionalImagePlaceholder() :
                    noMediaPlaceholder();
              }}
            />
          ) : hasVideos ? (
            videoPlaceholder()
          ) : hasAdditionalImages ? (
            <img
              src={`https://ishanib.demovoting.com/uploads/${firstImage}`}
              alt={product.features.find(f => f?.image)?.alt || product.title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
              loading="lazy"
            />
          ) : (
            noMediaPlaceholder()
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{product.category?.icon}</span>
            <span className="text-sm font-medium text-green-600">
              {product.category?.name}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {product.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {product.description}
          </p>
          <button
            onClick={() => navigate(`/contactus?product=${product.title}`)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            Enquire Now
          </button>
        </div>
      </motion.div>
    );
  };

  // Helper components
  const videoPlaceholder = () => (
    <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
        <FiPlay className="text-white text-xl" />
      </div>
      <span className="text-sm text-center text-gray-700 font-medium">
        Click to view video
      </span>
    </div>
  );

  const additionalImagePlaceholder = () => (
    <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </div>
      <span className="text-sm text-center text-gray-700 font-medium">
        View Gallery
      </span>
    </div>
  );

  const noMediaPlaceholder = () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <span className="text-gray-400">No media available</span>
    </div>
  );

  if (loading) return null;


  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8" id="products">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            Our Product Range
          </h2>
          <motion.div
            className="h-1 w-16 bg-green-500 mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: "4rem" }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore premium doors, windows, and security solutions for modern
            Indian homes.
          </p>
        </motion.div>

        {/* Desktop Filter Bar */}
        <motion.div
          className="hidden md:flex flex-wrap justify-center gap-3 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {["All", ...categories.map((cat) => cat.name)].map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${activeFilter === category
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              <span className="text-lg">
                {category === "All" ? "🌟" : categoryMap[category]?.icon}
              </span>
              {category}
            </button>
          ))}
        </motion.div>

        {/* Mobile Filter */}
        <div className="md:hidden mb-6 relative">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center justify-between w-full max-w-xs mx-auto bg-green-500 text-white px-5 py-3 rounded-full shadow"
          >
            <div className="flex items-center gap-2">
              <FiFilter />
              <span>
                {activeFilter === "All" ? "All Categories" : activeFilter}
              </span>
            </div>
            <FiChevronDown
              className={`transition-transform ${showMobileFilters ? "rotate-180" : ""
                }`}
            />
          </button>

          {/* Mobile Dropdown */}
          {showMobileFilters && (
            <motion.div
              className="absolute z-10 w-full max-w-xs mx-auto mt-2 bg-white rounded-lg shadow-xl overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              {["All", ...categories.map((cat) => cat.name)].map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveFilter(category);
                    setShowMobileFilters(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-left ${activeFilter === category
                    ? "bg-yellow-100 text-green-700"
                    : "hover:bg-gray-50"
                    }`}
                >
                  <span className="text-lg">
                    {category === "All" ? "🌟" : categoryMap[category]?.icon}
                  </span>
                  <span>{category}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Product Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {filteredProducts.map(renderProductCard)}
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-500 text-lg">
              No products found in this category.
            </p>
            <button
              onClick={() => setActiveFilter("All")}
              className="mt-4 text-green-600 font-medium hover:text-green-700"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Product Popup */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="fixed top-4 right-4 bg-white rounded-full p-2 shadow-lg z-10 hover:bg-gray-100 md:absolute md:top-4 md:right-4"
                onClick={closeModal}
              >
                <FiX className="text-gray-800 text-xl" />
              </button>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">
                    {selectedProduct.category?.icon}
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    {selectedProduct.category?.name}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {selectedProduct.title}
                </h3>
                <p className="text-gray-600 mb-6">{selectedProduct.description}</p>

                {/* Enhanced Media Gallery */}
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-800 mb-4 text-lg">
                    Product Gallery
                  </h4>

                  {/* Main Media Display */}
                  <div className="relative mb-4 h-96 rounded-lg overflow-hidden shadow-md bg-gray-100">
                    {getProductMedia(selectedProduct).length > 0 ? (
                      getProductMedia(selectedProduct)[activeMediaIndex].type === 'video' ? (
                        <video
                          controls
                          className="w-full h-full object-contain"
                          src={getProductMedia(selectedProduct)[activeMediaIndex].src}
                        />
                      ) : (
                        <img
                          src={getProductMedia(selectedProduct)[activeMediaIndex].src}
                          alt={getProductMedia(selectedProduct)[activeMediaIndex].alt}
                          className="w-full h-full object-contain"
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No media available
                      </div>
                    )}
                  </div>

                  {/* Navigation arrows if multiple media items */}
                  {getProductMedia(selectedProduct).length > 1 && (
                    <div className="flex justify-between absolute top-1/2 left-2 right-2 transform -translate-y-1/2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMediaIndex(prev =>
                            prev === 0 ? getProductMedia(selectedProduct).length - 1 : prev - 1
                          );
                        }}
                        className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                      >
                        <FiChevronLeft className="text-gray-800 text-xl" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMediaIndex(prev =>
                            prev === getProductMedia(selectedProduct).length - 1 ? 0 : prev + 1
                          );
                        }}
                        className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                      >
                        <FiChevronRight className="text-gray-800 text-xl" />
                      </button>
                    </div>
                  )}

                  {/* Thumbnail Grid */}
                  {getProductMedia(selectedProduct).length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-4">
                      {getProductMedia(selectedProduct).map((media, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMediaIndex(index);
                          }}
                          className={`relative h-20 rounded overflow-hidden ${activeMediaIndex === index ? 'border-2 border-green-500' : 'border-2 border-transparent hover:border-gray-300'}`}
                        >
                          {media.type === 'video' ? (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
                              <FiPlay className="text-gray-600 text-xl" />
                              <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                Video
                              </div>
                            </div>
                          ) : (
                            <img
                              src={media.src}
                              alt={media.alt}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {selectedProduct.specifications &&
                    typeof selectedProduct.specifications === "string" && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Specifications
                        </h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {selectedProduct.specifications
                            .split("\n")
                            .filter((spec) => spec.trim() !== "")
                            .map((spec, i) => (
                              <li key={i}>{spec.trim()}</li>
                            ))}
                        </ul>
                      </div>
                    )}

                  {selectedProduct.features &&
                    typeof selectedProduct.features === "string" && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Features
                        </h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {selectedProduct.features
                            .split("\n")
                            .filter((feature) => feature.trim() !== "")
                            .map((feature, i) => (
                              <li key={i}>{feature.trim()}</li>
                            ))}
                        </ul>
                      </div>
                    )}
                </div>
                <button
                  onClick={() => {
                    navigate(
                      `/contactus?product=${encodeURIComponent(
                        selectedProduct.title
                      )}`
                    );
                    closeModal();
                  }}
                  className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition"
                >
                  Enquire Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default OurProducts;

