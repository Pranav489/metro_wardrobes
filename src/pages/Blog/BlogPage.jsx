import React, { useEffect, useState, useMemo } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../../utils/motion";
import axios from "axios";
import { IMAGE_PATH } from "../../services/api";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 6,
    total: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchBlogs = async (page = 1, search = "", category = "") => {
    try {
      setLoading(true);
      setError(null); // Reset error state on new request

      let url = `https://ishanib.demovoting.com/api/blog?page=${page}`;

      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }

      const [postsRes, recentRes] = await Promise.all([
        axios.get(url),
        axios.get("https://ishanib.demovoting.com/api/blog/recent"),
      ]);

      // Handle successful responses
      setBlogs(postsRes.data.data || []);
      setRecentPosts(recentRes.data || []);
      setPagination({
        current_page: postsRes.data.current_page || 1,
        last_page: postsRes.data.last_page || 1,
        per_page: postsRes.data.per_page || 6,
        total: postsRes.data.total || 0,
      });

      // Extract unique categories
      const allCategories = (postsRes.data.data || []).map(post => post.category);
      setCategories([...new Set(allCategories)]);

    } catch (err) {
      // Handle different error scenarios
      if (err.response) {
        // Server responded with error status (4xx, 5xx)
        setError(err.response.data?.message || `Server error: ${err.response.status}`);
      } else if (err.request) {
        // Request was made but no response received
        setError("Network error - please check your connection");
      } else {
        // Other errors
        setError(err.message || "An unexpected error occurred");
      }

      // Reset data on error
      setBlogs([]);
      setRecentPosts([]);
      setPagination({
        current_page: 1,
        last_page: 1,
        per_page: 6,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchBlogs(page, searchQuery, selectedCategory);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBlogs(1, searchQuery, selectedCategory);
  };

  const debouncedSearch = useMemo(() =>
    _.debounce((query) => {
      fetchBlogs(1, query, selectedCategory);
    }, 500),
    [selectedCategory]);

  // Update your search input onChange handler
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    fetchBlogs(1, searchQuery, category);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (pagination.last_page <= maxVisiblePages) {
      startPage = 1;
      endPage = pagination.last_page;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
      const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

      if (pagination.current_page <= maxPagesBeforeCurrent) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (
        pagination.current_page + maxPagesAfterCurrent >=
        pagination.last_page
      ) {
        startPage = pagination.last_page - maxVisiblePages + 1;
        endPage = pagination.last_page;
      } else {
        startPage = pagination.current_page - maxPagesBeforeCurrent;
        endPage = pagination.current_page + maxPagesAfterCurrent;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 border rounded-md ${i === pagination.current_page
              ? "bg-green-500 text-white border-green-500"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
        >
          {i}
        </button>
      );
    }

    return (
      <nav className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(pagination.current_page - 1)}
          disabled={pagination.current_page === 1}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pages}

        {endPage < pagination.last_page && (
          <>
            {endPage < pagination.last_page - 1 && (
              <span className="px-2">...</span>
            )}
            <button
              onClick={() => handlePageChange(pagination.last_page)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              {pagination.last_page}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(pagination.current_page + 1)}
          disabled={pagination.current_page === pagination.last_page}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </nav>
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
      <div className="text-center py-12 text-red-500">
        Error loading blog posts: {error}
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20"
    >
      {/* SEO Meta (would be handled by React Helmet in real implementation) */}
      <title>
        Ishani Enterprises Blog | Door & Window Design Tips and Trends
      </title>
      <meta
        name="description"
        content="Explore our blog for expert tips on French door maintenance, window design trends, and industry insights from Ishani Enterprises."
      />

      {/* Page Header */}
      <motion.div
        variants={fadeIn("up", "spring", 0.1, 1)}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Ishani Enterprises Blog
        </h1>
        <div className="w-24 h-1 bg-green-500 mx-auto"></div>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Expert advice, design inspiration, and industry trends for doors and
          windows
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <motion.div
          variants={fadeIn("right", "spring", 0.2, 1)}
          className="lg:w-2/3"
        >
          {/* Blog Grid */}
          {blogs.length === 0 ? (
            <motion.div
              variants={fadeIn("up", "spring", 0.2, 1)}
              className="text-center py-12"
            >
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No blog posts found
              </h3>
              <p className="text-gray-500">
                {selectedCategory
                  ? `No posts in the "${selectedCategory}" category`
                  : searchQuery
                    ? `No posts matching "${searchQuery}"`
                    : "No posts available"}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                  fetchBlogs();
                }}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <>
              <motion.div
                variants={staggerContainer(0.1, 0.2)}
                className="grid md:grid-cols-2 gap-8"
              >
                {blogs.map((blog, index) => (
                  <motion.article
                    key={blog.id}
                    variants={fadeIn("up", "spring", index * 0.1, 1)}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <Link to={`/blog/${blog.slug}`}>
                      <img
                        src={`${IMAGE_PATH}/${blog.image_url}`}
                        alt={blog.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <span className="inline-block px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full mb-2">
                          {blog.category}
                        </span>
                        <h2 className="text-xl font-bold text-gray-800 mb-2 hover:text-green-600 transition-colors">
                          {blog.title}
                        </h2>
                        <p className="text-gray-600 mb-4">{blog.excerpt}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            {new Date(blog.published_date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                          <span className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
                            Read More →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </motion.div>

              {/* Pagination */}
              {pagination.last_page > 1 && (
                <motion.div
                  variants={fadeIn("up", "spring", 0.4, 1)}
                  className="mt-12 flex justify-center"
                >
                  {renderPagination()}
                </motion.div>
              )}
            </>
          )}
        </motion.div>

        {/* Sidebar */}
        <motion.aside
          variants={fadeIn("left", "spring", 0.3, 1)}
          className="lg:w-1/3"
        >
          <div className="bg-gray-50 p-6 rounded-lg sticky top-8">
            {/* Search */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Search
              </h3>

              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </form>
            </div>

            {/* Recent Posts */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Posts
              </h3>
              <ul className="space-y-3">
                {recentPosts.map((post) => (
                  <li key={post.id}>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="flex items-start gap-3 group"
                    >
                      <img
                        src={`${IMAGE_PATH}/${post.image_url}`}
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h4 className="text-sm font-medium text-gray-800 group-hover:text-green-600 transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {new Date(post.published_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Categories
              </h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleCategorySelect("")}
                    className={`flex items-center justify-between w-full text-left ${!selectedCategory
                        ? "text-green-600 font-medium"
                        : "text-gray-600 hover:text-green-600"
                      } transition-colors`}
                  >
                    <span>All Categories</span>
                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {pagination.total}
                    </span>
                  </button>
                </li>
                {categories.map((category, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleCategorySelect(category)}
                      className={`flex items-center justify-between w-full text-left ${selectedCategory === category
                          ? "text-green-600 font-medium"
                          : "text-gray-600 hover:text-green-600"
                        } transition-colors`}
                    >
                      <span>{category}</span>
                      <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {blogs.filter((b) => b.category === category).length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Subscribe
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Get the latest articles and news delivered to your inbox
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </motion.aside>
      </div>
    </motion.div>
  );
};

export default BlogPage;
