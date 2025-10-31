import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPhone,
  FiCalendar,
  FiMessageSquare,
  FiPlay,
  FiX
} from "react-icons/fi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axiosInstance from "../../services/api";

const ProductsPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(category || "All");
  const [contactData, setContactData] = useState(null);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const sampleImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
  ];
  // State for all data
  const [data, setData] = useState({
    products: [],
    categories: [],
    testimonials: [],
    faqs: [],
    categoryIcons: {},
  });

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [productsRes, categoriesRes, testimonialsRes, faqsRes, contactRes] =
          await Promise.all([
            axiosInstance.get("/products"),
            axiosInstance.get("/productcategories"),
            axiosInstance.get("/customertestimonials"),
            axiosInstance.get("/faqs"),
            axiosInstance.get("/contact"),
          ]);

        // Create category icons mapping from categories data
        const categoryIcons = {};
        categoriesRes?.data?.data?.forEach((cat) => {
          if (cat?.name) {
            categoryIcons[cat.name] = cat?.icon;
          }
        });

        setData({
          products: productsRes?.data?.data || [],
          categories: categoriesRes?.data?.data || [],
          testimonials: testimonialsRes?.data?.data || [],
          faqs: faqsRes?.data?.data || [],
          categoryIcons,
        });
        setContactData(contactRes?.data || null);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Set initial filter based on URL
  useEffect(() => {
    if (category && data?.categories?.length > 0) {
      // Find the category that matches the URL path
      const matchedCategory = data.categories.find(
        (cat) => cat?.name?.toLowerCase()?.replace(/\s+/g, "-") === category
      );
      if (matchedCategory?.name) {
        setActiveFilter(matchedCategory.name);
      }
    }
  }, [category, data.categories]);

  // Filter products
  const filteredProducts =
    activeFilter === "All"
      ? data.products
      : data.products.filter((product) => {
        const productCategory = data.categories.find(
          (cat) => cat.id === product?.category_id
        );
        return productCategory?.name === activeFilter;
      });

  // Toggle FAQ
  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const handleProductClick = (product, e) => {
    // Don't open popup if click was on the Enquire Now button
    if (e.target.closest("button")) return;
    setSelectedProduct(product);
  };

  if (loading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-gray-100">
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

  if (error) return <ErrorDisplay message={error} />;

  return (
    <section className="bg-white mt-20">
      <AnimatePresence>
        {selectedProduct && (
          <ProductPopup
            product={selectedProduct}
            categoryIcons={data.categoryIcons}
            onClose={() => setSelectedProduct(null)}
            navigate={navigate}
            sampleImages={sampleImages}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          category={category}
          navigate={navigate}
          categories={data.categories}
        />

        {/* Dynamic Category Header */}
        <CategoryHeader
          category={category}
          activeFilter={activeFilter}
          categories={data.categories}
          filteredProducts={filteredProducts}
        />

        {/* Dynamic Category Filters */}
        {!category && (
          <CategoryFilters
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            navigate={navigate}
            categories={data.categories}
          />
        )}

        {/* Category Benefits */}
        {category && (
          <CategoryBenefits
            category={activeFilter}
            categories={data.categories}
          />
        )}

        {/* Product Grid */}
        {filteredProducts?.length > 0 ? (
          <ProductGrid
            filteredProducts={filteredProducts}
            categories={data.categories}
            categoryIcons={data.categoryIcons}
            onProductClick={handleProductClick}
          />
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No products found in this category.
            </p>
            <button
              onClick={() => setActiveFilter("All")}
              className="mt-4 text-green-600 font-medium hover:text-green-700"
            >
              View All Products
            </button>
          </div>
        )}

        {/* Common Sections */}
        <WhyChooseUs />
        <TestimonialsSection testimonials={data.testimonials} />
        <FAQSection
          faqs={data.faqs}
          activeFAQ={activeFAQ}
          toggleFAQ={toggleFAQ}
        />
        <CTASection contactData={contactData} />
      </div>
    </section>
  );
};

// Updated Product Popup Component
const ProductPopup = ({
  product,
  categoryIcons,
  onClose,
  navigate,
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaType, setMediaType] = useState('image');

  // Get all media items - UPDATED FOR OBJECT-BASED FEATURES
  const allMedia = React.useMemo(() => {
    const media = [];

    // 1. Add features images if they exist (now handling object format)
    if (Array.isArray(product?.features)) {
      product.features.forEach((feature) => {
        if (feature?.image && typeof feature.image === 'string' && feature.image.trim()) {
          media.push({
            type: 'image',
            src: `https://ishanib.demovoting.com/uploads/${feature.image.trim()}`,
            alt: feature?.alt || 'Product feature'
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
      const videos = Array.isArray(product.videos) ? product.videos : [product.videos];
      videos.forEach(video => {
        if (video && typeof video === 'string' && video.trim()) {
          media.push({
            type: 'video',
            src: `https://ishanib.demovoting.com/uploads/${video.trim()}`,
            alt: `${product?.title || 'Product'} video`
          });
        }
      });
    }

    return media;
  }, [product]);

  const hasMultipleMedia = allMedia.length > 1;

  // Navigation functions
  const goToPrevMedia = () => {
    setCurrentMediaIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1));
  };

  const goToNextMedia = () => {
    setCurrentMediaIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1));
  };

  // Set media type when current index changes
  useEffect(() => {
    if (allMedia[currentMediaIndex]) {
      setMediaType(allMedia[currentMediaIndex].type);
    }
  }, [currentMediaIndex, allMedia]);

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Popup content */}
        <div className="p-6">
          {/* Header and product info */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">
              {categoryIcons[product?.category?.name]}
            </span>
            <span className="text-sm font-medium text-green-600">
              {product?.category?.name}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            {product?.title}
          </h3>
          <p className="text-gray-600 mb-6">{product?.description}</p>

          {/* Media Gallery */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-800 mb-4 text-lg">
              Product Gallery
            </h4>

            {/* Main Media Display */}
            <div className="relative mb-4 h-96 rounded-lg overflow-hidden shadow-md bg-gray-100">
              {allMedia.length > 0 ? (
                mediaType === 'image' ? (
                  <img
                    src={allMedia[currentMediaIndex].src}
                    alt={allMedia[currentMediaIndex].alt}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                      e.target.parentElement.innerHTML = `
                        <div class="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span class="text-gray-400">Image not available</span>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <video
                    key={allMedia[currentMediaIndex].src}
                    controls
                    className="w-full h-full object-contain"
                    src={allMedia[currentMediaIndex].src}
                    poster={allMedia[currentMediaIndex].poster}
                  >
                    Your browser does not support the video tag.
                  </video>
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No media available
                </div>
              )}

              {hasMultipleMedia && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevMedia();
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white"
                  >
                    <FiChevronLeft className="text-gray-800 text-xl" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNextMedia();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white"
                  >
                    <FiChevronRight className="text-gray-800 text-xl" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Grid - Only show if there are multiple media items */}
            {hasMultipleMedia && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-4">
                {allMedia.map((media, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentMediaIndex(index);
                      setMediaType(media.type);
                    }}
                    className={`relative h-20 rounded overflow-hidden border-2 transition-all ${currentMediaIndex === index
                        ? "border-green-500"
                        : "border-transparent hover:border-gray-300"
                      }`}
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
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '';
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span class="text-xs text-gray-500">Image</span>
                            </div>
                          `;
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {product?.specifications &&
              typeof product.specifications === "string" && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Specifications
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {product.specifications
                      .split("\n")
                      .filter((spec) => spec.trim() !== "")
                      .map((spec, i) => (
                        <li key={i}>{spec.trim()}</li>
                      ))}
                  </ul>
                </div>
              )}

            {product?.features &&
              typeof product.features === "string" && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Features
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {product.features
                      .split("\n")
                      .filter((feature) => feature.trim() !== "")
                      .map((feature, i) => (
                        <li key={i}>{feature.trim()}</li>
                      ))}
                  </ul>
                </div>
              )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => {
                navigate(
                  `/contactus?product=${encodeURIComponent(product?.title)}`
                );
                onClose();
              }}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition"
            >
              Enquire Now
            </button>
            <button
              onClick={() => {
                navigate("/factory-outlet/#book-visit");
                onClose();
              }}
              className="w-full border border-green-500 text-green-600 hover:bg-green-50 font-medium py-3 px-6 rounded-lg transition"
            >
              <FiCalendar className="inline mr-2" />
              Book Factory Visit
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Error Display Component
const ErrorDisplay = ({ message }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-3xl mx-auto mt-10">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg
          className="h-5 w-5 text-red-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm text-red-700">
          {message || "An error occurred while loading data."}
        </p>
      </div>
    </div>
  </div>
);

// Component: Breadcrumbs
const Breadcrumbs = ({ category, navigate, categories = [] }) => {
  // Generate path map dynamically from categories
  const pathToCategoryMap = categories.reduce((acc, cat) => {
    const path = cat?.name?.toLowerCase()?.replace(/\s+/g, "-");
    if (path) {
      acc[path] = cat.name;
    }
    return acc;
  }, {});

  return (
    <div className="flex items-center mb-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-green-600 hover:text-green-700 mr-4"
      >
        <FiArrowLeft className="mr-1" /> Back
      </button>
      <nav className="text-sm text-gray-600">
        <span
          className="hover:text-green-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Home
        </span>
        <span className="mx-2">/</span>
        <span
          className="hover:text-green-600 cursor-pointer"
          onClick={() => navigate("/products")}
        >
          Products
        </span>
        {category && (
          <>
            <span className="mx-2">/</span>
            <span className="text-green-600">
              {categories.find(
                (cat) =>
                  cat?.name?.toLowerCase()?.replace(/\s+/g, "-") === category
              )?.name || category.replace(/-/g, " ")}
            </span>
          </>
        )}
      </nav>
    </div>
  );
};

// Component: Category Header
const CategoryHeader = ({
  category,
  activeFilter,
  categories = [],
  filteredProducts = [],
}) => {
  // Find current category details
  const currentCategory =
    categories.find(
      (cat) =>
        cat?.name ===
        (activeFilter || (category && category.replace(/-/g, " ")))
    ) || {};

  return (
    <motion.div
      className="text-left mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-4xl font-bold text-gray-800 mb-3">
        {category
          ? currentCategory?.name || category.replace(/-/g, " ").toUpperCase()
          : "Premium Door Solutions"}
      </h2>
      <motion.div
        className="h-1 w-16 bg-green-500 mb-6"
        initial={{ width: 0 }}
        animate={{ width: "4rem" }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />
      <p className="text-gray-600 max-w-2xl mb-4">
        {currentCategory?.description ||
          "Explore our complete range of premium doors, windows, and security solutions"}
      </p>
      <p className="text-gray-500 text-sm">
        {category
          ? currentCategory?.collection_text_template
            ? currentCategory.collection_text_template
              ?.replace("{category}", currentCategory.name?.toLowerCase())
              ?.replace("{count}", filteredProducts.length)
              ?.replace(
                "{descriptor}",
                currentCategory.product_descriptor?.toLowerCase() ||
                "products"
              )
            : `Browse our ${currentCategory.name?.toLowerCase()} collection`
          : currentCategory?.homepage_text ||
          "Trusted by 5000+ homeowners across India since 2010"}
      </p>
    </motion.div>
  );
};

// Component: Category Filters
const CategoryFilters = ({
  activeFilter,
  setActiveFilter,
  navigate,
  categories = [],
}) => {
  return (
    <motion.div
      className="flex flex-wrap gap-3 mb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      {categories.map((cat) => {
        const path = cat?.name?.toLowerCase()?.replace(/\s+/g, "-");
        return (
          <button
            key={path}
            onClick={() => {
              setActiveFilter(cat.name);
              navigate(`/products/${path}`);
            }}
            className={`px-4 py-2 rounded-full transition-all ${activeFilter === cat.name
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {cat.name}
          </button>
        );
      })}
      <button
        onClick={() => {
          setActiveFilter("All");
          navigate("/products");
        }}
        className={`px-4 py-2 rounded-full transition-all ${activeFilter === "All"
            ? "bg-green-500 text-white shadow-md"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
      >
        View All
      </button>
    </motion.div>
  );
};

// Component: Category Benefits
const CategoryBenefits = ({ category, categories = [] }) => {
  // Find the current category with its benefits
  const currentCategory = categories.find((c) => c?.name === category);

  return (
    <div className="mb-12 bg-gray-50 p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Why Choose Our {category}?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentCategory?.benefits?.map((benefit, index) => (
          <div key={index} className="flex items-start">
            <div className="text-green-500 mr-3 mt-1">✓</div>
            <div>
              <h4 className="font-medium text-gray-800">{benefit?.title}</h4>
              {benefit?.description && (
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component: Product Grid
const ProductGrid = ({
  filteredProducts = [],
  categories = [],
  categoryIcons = {},
  onProductClick,
}) => (
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
    {filteredProducts.map((product) => (
      <ProductCard
        key={product?.id}
        product={product}
        categories={categories}
        categoryIcons={categoryIcons}
        onClick={onProductClick}
      />
    ))}
  </motion.div>
);

// Component: Product Card - Updated to prioritize images over videos
const ProductCard = ({
  product,
  categories = [],
  categoryIcons = {},
  onClick,
}) => {
  const category = categories.find((cat) => cat?.id === product?.category_id);
  const navigate = useNavigate();

  // Check media availability (updated to handle additional images)
  const hasMainImage = product?.image && typeof product.image === 'string' && product.image.trim() !== '';
  const hasVideos = product?.videos && (Array.isArray(product.videos) ? product.videos.some(v => v && typeof v === 'string' && v.trim())
    : typeof product.videos === 'string' && product.videos.trim());
  const hasAdditionalImages = Array.isArray(product?.features) &&
    product.features.some(f => f?.image && typeof f.image === 'string' && f.image.trim());

  // Get first available image (main or from features)
  const firstImage = hasMainImage ? product.image :
    (hasAdditionalImages ? product.features.find(f => f?.image)?.image : null);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
      }}
      className="bg-white rounded-xl overflow-hidden border border-gray-100 transition-all cursor-pointer"
      onClick={(e) => onClick(product, e)}
    >
      <div className="relative h-48 overflow-hidden">
        {/* Priority: 1. Main image, 2. Video, 3. First additional image, 4. Placeholder */}
        {hasMainImage ? (
          <img
            src={`https://ishanib.demovoting.com/uploads/${product.image}`}
            alt={product?.image_alt || product?.title}
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
            alt={product.features.find(f => f?.image)?.alt || product?.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            loading="lazy"
          />
        ) : (
          noMediaPlaceholder()
        )}
      </div>
      <div className="p-5">
        {category && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{categoryIcons[category?.name]}</span>
            <span className="text-sm font-medium text-green-600">
              {category?.name}
            </span>
          </div>
        )}
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {product?.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {product?.description}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/contactus?product=${encodeURIComponent(product?.title)}`);
          }}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          Enquire Now
        </button>
      </div>
    </motion.div>
  );
};

function videoPlaceholder() {
  return (
    <div class="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
      <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
        <FiPlay class="text-white text-xl" />
      </div>
      <span class="text-sm text-center text-gray-700 font-medium">
        Click to view video
      </span>
    </div>
  );
}

function additionalImagePlaceholder() {
  return (
    <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <span className="text-sm text-center text-gray-600 font-medium">
        View Gallery
      </span>
    </div>
  );
}

function noMediaPlaceholder() {
  return (
    <div class="w-full h-full bg-gray-100 flex items-center justify-center">
      <span class="text-gray-400">No media available</span>
    </div>
  );
}


// Component: Why Choose Us
const WhyChooseUs = () => (
  <div className="mt-16">
    <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
      Why Choose Ishani Enterprises?
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        {
          icon: "🏭",
          title: "15+ Years Experience",
          desc: "Trusted manufacturer since 2008",
        },
        {
          icon: "🛡",
          title: "Premium Materials",
          desc: "Using only certified raw materials",
        },
        {
          icon: "👷",
          title: "Expert Installation",
          desc: "Trained professionals for perfect fitting",
        },
        {
          icon: "📝",
          title: "5-10 Year Warranty",
          desc: "Comprehensive coverage on all products",
        },
      ].map((item, index) => (
        <div key={index} className="text-center p-4">
          <div className="text-4xl mb-3">{item.icon}</div>
          <h4 className="font-semibold text-lg mb-1">{item.title}</h4>
          <p className="text-gray-600 text-sm">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

// Component: Testimonials
const TestimonialsSection = ({ testimonials = [] }) => (
  <div className="mt-16">
    <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
      What Our Customers Say
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials.map((testimonial, index) => (
        <div key={index} className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`text-2xl mr-1 ${i < testimonial?.rating ? "text-green-500" : "text-gray-300"
                  }`}
              >
                ★
              </div>
            ))}
          </div>
          <p className="text-gray-600 mb-4 italic">"{testimonial?.quote}"</p>
          <div className="flex items-center">
            <div className="font-medium text-gray-800">{testimonial?.name}</div>
            <div className="mx-2 text-gray-400">•</div>
            <div className="text-gray-500 text-sm">{testimonial?.location}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Component: FAQ
const FAQSection = ({ faqs = [], activeFAQ, toggleFAQ }) => (
  <div className="mt-16 border-t pt-12">
    <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
      Frequently Asked Questions
    </h3>
    <div className="max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="border-b pb-4">
          <button
            className="flex justify-between items-center w-full text-left font-medium text-gray-800"
            onClick={() => toggleFAQ(index)}
          >
            <span>{faq?.question}</span>
            <span className="text-xl">{activeFAQ === index ? "−" : "+"}</span>
          </button>
          {activeFAQ === index && (
            <div className="mt-2 text-gray-600">{faq?.answer}</div>
          )}
        </div>
      ))}
    </div>
  </div>
);

// Component: CTA
const CTASection = ({ contactData }) => {
  const navigate = useNavigate();
  
  return (
    <div className="mt-16 bg-green-50 rounded-xl p-8 text-center">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        Ready to Transform Your Space?
      </h3>
      <p className="text-gray-600 max-w-2xl mx-auto mb-6">
        Get expert advice and a free quote for your project today.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <a
          href={`tel:${contactData?.mobile_number || '905321121'}`}
          className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition"
        >
          <FiPhone className="mr-2" /> Call Now
        </a>
        <a
          href={`${contactData?.social_link_5 || 'https://wa.me/8208095812'}?text=Hello%20there!`}
          className="flex items-center justify-center border border-green-500 text-green-600 hover:bg-green-50 font-medium py-3 px-6 rounded-lg transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FiMessageSquare className="mr-2" /> WhatsApp Us
        </a>
        <button
          onClick={() => navigate("/factory-outlet/#book-visit")}
          className="flex items-center justify-center border border-green-500 text-green-600 hover:bg-green-50 font-medium py-3 px-6 rounded-lg transition"
        >
          <FiCalendar className="mr-2" /> Book Consultation
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;