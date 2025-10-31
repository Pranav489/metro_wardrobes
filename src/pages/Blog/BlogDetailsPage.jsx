import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn } from "../../utils/motion";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaPinterest,
  FaWhatsapp,
  FaSearch,
} from "react-icons/fa";
import axios from "axios";
import DOMPurify from "dompurify";

const BlogDetailsPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "https://ishanib.demovoting.com/api";
  const STORAGE_URL = "https://ishanib.demovoting.com/uploads";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, recentRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/blog/${slug}`),
          axios.get(`${API_BASE_URL}/blog/recent`),
        ]);
        console.log(postRes.data);
        setBlog(postRes.data.post);
        setRecentPosts(recentRes.data.filter((post) => post.slug !== slug));
      } catch (err) {
        setError(err.message || "Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // Process content with image URL correction and sanitization
  const processedContent = useMemo(() => {
    if (!blog?.content) return "";

    // Fix relative image paths
    let fixedContent = blog.content.replace(/src="([^"]*)"/g, (match, src) =>
      src.startsWith("http") ? match : src=`${STORAGE_URL}/${src}`
    );

    // Sanitize HTML
    return DOMPurify.sanitize(fixedContent, {
      ALLOWED_TAGS: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "img",
        "br",
        "strong",
        "em",
        "ul",
        "ol",
        "li",
        "a",
        "div",
        "span",
      ],
      ALLOWED_ATTR: [
        "src",
        "alt",
        "href",
        "class",
        "style",
        "width",
        "height",
        "id",
      ],
    });
  }, [blog?.content]);

  const formattedDate = useMemo(() => {
    return blog?.published_date
      ? new Date(blog.published_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";
  }, [blog?.published_date]);

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
    return <ErrorDisplay message={error} />;
  }

  if (!blog) {
    return <NotFoundDisplay />;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <motion.div
          variants={fadeIn("right", "spring", 0.2, 1)}
          className="lg:w-2/3"
        >
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Featured Image */}
            <img
              src={`${STORAGE_URL}/${blog.image_url}`}
              alt={blog.title}
              className="w-full h-96 object-cover"
              loading="lazy"
            />

            <div className="p-8">
              <BlogHeader
                category={blog.category}
                date={formattedDate}
                title={blog.title}
              />

              <AuthorInfo
                avatar={`${STORAGE_URL}/${blog.author_avatar}`}
                name={blog.author_name}
                role={blog.author_role}
              />

              {/* Rich Editor Content */}
              {/* Article Content */}
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              ></div>

              {blog.related_products?.length > 0 && (
                <RelatedProducts products={blog.related_products} />
              )}

              <SocialSharing
                url={window.location.href}
                title={blog.title}
                imageUrl={`${STORAGE_URL}/${blog.image_url}`}
                excerpt={blog.excerpt}
              />
            </div>
          </article>

          <CommentsSection />
        </motion.div>

        {/* Sidebar */}
        <BlogSidebar recentPosts={recentPosts} storageUrl={STORAGE_URL} />
      </div>
    </motion.div>
  );
};

// Extracted Components

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="text-center py-12 text-red-500">
    Error loading blog post: {message}
  </div>
);

const NotFoundDisplay = () => (
  <div className="text-center py-12">Blog post not found</div>
);

const BlogHeader = ({ category, date, title }) => (
  <>
    <div className="flex items-center justify-between mb-4">
      <span className="inline-block px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
        {category}
      </span>
      <span className="text-sm text-gray-500">{date}</span>
    </div>
    <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
  </>
);

const AuthorInfo = ({ avatar, name, role }) => (
  <div className="flex items-center gap-4 mb-8">
    <img
      src={avatar}
      alt={name}
      className="w-12 h-12 rounded-full object-cover"
      loading="lazy"
    />
    <div>
      <h4 className="font-medium text-gray-800">{name}</h4>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  </div>
);

const RelatedProducts = ({ products }) => (
  <div className="mt-12 bg-gray-50 p-6 rounded-lg">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">
      Related Products
    </h3>
    <ul className="space-y-2">
      {products.map((product, index) => (
        <li key={index}>
          <Link
            to={product.link}
            className="text-green-600 hover:text-green-700 hover:underline"
          >
            {product.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const SocialSharing = ({ url, title, imageUrl, excerpt }) => (
  <div className="mt-12 pt-6 border-t border-gray-200">
    <h4 className="text-lg font-medium text-gray-800 mb-4">
      Share this article
    </h4>
    <div className="flex gap-4">
      <SocialShareButton
        platform="facebook"
        url={url}
        Icon={FaFacebook}
        color="bg-blue-600 hover:bg-blue-700"
      />
      <SocialShareButton
        platform="twitter"
        url={url}
        text={title}
        Icon={FaTwitter}
        color="bg-blue-400 hover:bg-blue-500"
      />
      <SocialShareButton
        platform="linkedin"
        url={url}
        title={title}
        Icon={FaLinkedin}
        color="bg-blue-700 hover:bg-blue-800"
      />
      <SocialShareButton
        platform="pinterest"
        url={url}
        media={imageUrl}
        description={excerpt}
        Icon={FaPinterest}
        color="bg-red-600 hover:bg-red-700"
      />
      <SocialShareButton
        platform="whatsapp"
        url={url}
        text={title}
        Icon={FaWhatsapp}
        color="bg-green-500 hover:bg-green-600"
      />
    </div>
  </div>
);

const SocialShareButton = ({
  platform,
  url,
  text,
  title,
  media,
  description,
  Icon,
  color,
}) => {
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
      url
    )}&media=${encodeURIComponent(media)}&description=${encodeURIComponent(
      description
    )}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${text} ${url}`
    )}`,
  };

  return (
    <a
      href={shareUrls[platform]}
      target="_blank"
      rel="noopener noreferrer"
      className={`${color} text-white p-3 rounded-full transition-colors`}
      aria-label={`Share on ${
        platform.charAt(0).toUpperCase() + platform.slice(1)
      }`}
    >
      <Icon size={18} />
    </a>
  );
};

const CommentsSection = () => (
  <motion.div
    variants={fadeIn("up", "spring", 0.4, 1)}
    className="mt-12 bg-white rounded-lg shadow-md p-8"
  >
    <h3 className="text-xl font-semibold text-gray-800 mb-6">Comments (0)</h3>
    <div className="border-t border-gray-200 pt-6">
      <h4 className="text-lg font-medium text-gray-800 mb-4">
        Leave a comment
      </h4>
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField id="name" label="Name *" type="text" required />
          <InputField id="email" label="Email *" type="email" required />
        </div>
        <InputField id="comment" label="Comment *" type="textarea" required />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
        >
          Post Comment
        </button>
      </form>
    </div>
  </motion.div>
);

const InputField = ({ id, label, type = "text", required = false }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        id={id}
        rows={4}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
        required={required}
      />
    ) : (
      <input
        type={type}
        id={id}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
        required={required}
      />
    )}
  </div>
);

const BlogSidebar = ({ recentPosts, storageUrl }) => (
  <motion.aside
    variants={fadeIn("left", "spring", 0.3, 1)}
    className="lg:w-1/3"
  >
    <div className="bg-gray-50 p-6 rounded-lg sticky top-8">
      <SearchWidget />
      <RecentPosts posts={recentPosts} storageUrl={storageUrl} />
      <NewsletterWidget />
    </div>
  </motion.aside>
);

const SearchWidget = () => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Search</h3>
    <div className="relative">
      <input
        type="text"
        placeholder="Search articles..."
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
      />
      <button className="absolute right-3 top-2.5 text-gray-400 hover:text-green-500">
        <FaSearch className="h-5 w-5" />
      </button>
    </div>
  </div>
);

const RecentPosts = ({ posts, storageUrl }) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Posts</h3>
    <ul className="space-y-3">
      {posts.map((post) => (
        <li key={post.id}>
          <Link
            to={`/blog/${post.slug}`}
            className="flex items-start gap-3 group"
          >
            <img
              src={`${storageUrl}/${post.image_url}`}
              alt={post.title}
              className="w-16 h-16 object-cover rounded"
              loading="lazy"
            />
            <div>
              <h4 className="text-sm font-medium text-gray-800 group-hover:text-green-600 transition-colors">
                {post.title}
              </h4>
              <p className="text-xs text-gray-500">
                {new Date(post.published_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const NewsletterWidget = () => (
  <div>
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Subscribe</h3>
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
);

export default BlogDetailsPage;