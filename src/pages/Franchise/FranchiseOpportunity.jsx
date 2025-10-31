import React from "react";
import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import parse, { domToReact } from "html-react-parser";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer, zoomIn } from "../../utils/motion";
import { FaWhatsapp } from "react-icons/fa";

const FranchisePage = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    preferred_city: "",
    investment_capacity: "10-20 lakhs",
    business_experience: "",
    consent_marketing: false,
  });

  const [franchiseSP, setFranchiseSP] = useState({});
  const [contactData, setContactData] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchContactData = async () => {
    try {
      const response = await axios.get("https://ishanib.demovoting.com/api/contact");
      setContactData(response.data || null);
    } catch (error) {
      console.error("Error fetching contact information:", error);
      setContactData(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch franchise data
        try {
          const franchiseResponse = await axios.get("https://ishanib.demovoting.com/api/franchise");
          setFranchiseSP(franchiseResponse.data.data);
        } catch (franchiseError) {
          console.error("Error fetching franchise data:", franchiseError);
        }

        // Fetch contact data
        await fetchContactData();

      } catch (error) {
        console.error("Error in fetchData:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash) {
        const id = window.location.hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        }
      }
    };

    // Run once on mount
    handleHashChange();

    // Add hashchange event listener
    window.addEventListener('hashchange', handleHashChange);

    // Cleanup
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  const renderRichContent = (html) => {
    const sanitized = DOMPurify.sanitize(html || "");

    const options = {
      replace: (domNode) => {
        if (domNode.name === "ul" && Array.isArray(domNode.children)) {
          return (
            <ul className="space-y-4 text-gray-600">
              {domToReact(domNode.children, options)}
            </ul>
          );
        }

        if (domNode.name === "li") {
          const children = domToReact(domNode.children, options);
          return (
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✓</span>
              <span>{children}</span>
            </li>
          );
        }

        if (domNode.name === "strong") {
          return (
            <strong className="text-gray-800">
              {domToReact(domNode.children, options)}
            </strong>
          );
        }
      },
    };

    return parse(sanitized, options);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("submitting");
    setSubmitError(null);

    try {
      const response = await axios.post(
        "https://ishanib.demovoting.com/api/franchise-applications",
        formData,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      console.log(response?.data);
      if (response.status >= 200 && response.status < 300) {
        setSubmitStatus("success");
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          preferred_city: "",
          investment_capacity: "10-20 lakhs",
          business_experience: "",
          consent_marketing: false,
        });
      } else {
        throw new Error(response.data?.message || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");

      if (err.response) {
        // Server responded with a status code outside 2xx range
        if (err.response.data?.errors) {
          // Validation errors from server
          setSubmitError(
            Object.values(err.response.data.errors).join(" ") ||
            "Please check your input and try again."
          );
        } else {
          setSubmitError(
            err.response.data?.message ||
            `Server error: ${err.response.status} - ${err.response.statusText}`
          );
        }
      } else if (err.request) {
        // Request was made but no response received
        setSubmitError(
          "Network error - please check your connection and try again."
        );
      } else {
        // Something else happened
        setSubmitError(err.message || "An unexpected error occurred.");
      }
    }
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

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="max-w-7xl mt-24 mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {/* Page Header */}
      <motion.div
        variants={fadeIn("up", "spring", 0.1, 1)}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Ishani Enterprises Partnership Opportunities
        </h1>
        <div className="w-24 h-1 bg-green-500 mx-auto"></div>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Join India's premium French doors and windows brand with proven
          business model
        </p>
      </motion.div>

      {/* Quick Navigation */}
      <motion.div
        variants={staggerContainer(0.1, 0.2)}
        className="flex flex-wrap justify-center gap-4 mb-16"
      >
        {[
          { label: "Why Partner", path: "#why-partner" },
          { label: "Benefits", path: "#benefits" },
          { label: "Cities", path: "#cities" },
          { label: "Apply Now", path: "#apply" },
        ].map((item, index) => (
          <motion.div
            key={index}
            variants={fadeIn("right", "spring", index * 0.2, 0.75)}
          >
            <a
              href={item.path}
              className="px-4 py-2 bg-gray-100 hover:bg-green-500 hover:text-white rounded-md transition-colors"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(item.path.substring(1));
                if (element) {
                  element.scrollIntoView({ behavior: "smooth", block: "start" });
                  // Update URL without triggering refresh
                  window.history.pushState(null, null, item.path);
                }
              }}
            >
              {item.label}
            </a>
          </motion.div>
        ))}
      </motion.div>


      {/* Why Partner Section */}
      <motion.section
        id="why-partner"
        className="mb-20 scroll-mt-20"
        variants={staggerContainer(0.1, 0.3)}
      >
        <motion.div variants={fadeIn("up", "spring", 0.2, 1)}>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Why Choose Ishani Enterprises?
          </h2>
          <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            Become part of India's fastest growing premium doors and windows
            brand
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer(0.1, 0.2)}
        >
          {[
            {
              icon: "🏭",
              title: "Established Manufacturing",
              description:
                "15+ years of expertise in premium door and window manufacturing",
            },
            {
              icon: "📈",
              title: "Proven Business Model",
              description:
                "Turnkey franchise system with demonstrated success across India",
            },
            {
              icon: "🏆",
              title: "Brand Recognition",
              description:
                "Award-winning brand known for quality and innovation",
            },
            {
              icon: "🛠️",
              title: "Comprehensive Training",
              description:
                "Complete technical and sales training for your team",
            },
            {
              icon: "📊",
              title: "Marketing Support",
              description:
                "National advertising + local marketing collateral provided",
            },
            {
              icon: "💰",
              title: "Attractive Margins",
              description: "Industry-leading margins and ROI potential",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={fadeIn("up", "spring", index * 0.1, 1)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        id="benefits"
        className="mb-20 py-10 bg-gray-50 rounded-xl px-8 scroll-mt-20"
        variants={fadeIn("up", "spring", 0.3, 1)}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeIn("up", "spring", 0.2, 1)}>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Partnership Benefits & Support
            </h2>
            <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
              We provide everything you need to succeed as an Ishani Partner
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={staggerContainer(0.1, 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <motion.div variants={fadeIn("right", "spring", 0.3, 1)}>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Partnership Support
                </h3>
                {renderRichContent(franchiseSP?.benefits)}
              </div>
            </motion.div>

            <motion.div variants={fadeIn("left", "spring", 0.3, 1)}>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Partnership Benefits
                </h3>
                {renderRichContent(franchiseSP?.support)}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Cities Section */}
      <motion.section
        id="cities"
        className="mb-20 scroll-mt-20"
        variants={staggerContainer(0.1, 0.3)}
      >
        <motion.div variants={fadeIn("up", "spring", 0.2, 1)}>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Cities Available for Expansion
          </h2>
          <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            We're expanding across Maharashtra and neighboring states
          </p>
        </motion.div>

        <motion.div
          variants={fadeIn("up", "spring", 0.3, 1)}
          className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {franchiseSP.expansion_cities?.length > 0 ? (
              franchiseSP.expansion_cities.map((city, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md text-center">
                  {city}
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                Loading available cities...
              </p>
            )}
          </div>
          <p className="text-center text-gray-600 mt-6">
            Don't see your city? We're constantly expanding -{" "}
              <a
                href={"#apply"}
                className="text-green-600 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("#apply".substring(1));
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                    // Update URL without triggering refresh
                    window.history.pushState(null, null, "#apply");
                  }
                }}
              >
                Apply Anyway
              </a>
          </p>
        </motion.div>
      </motion.section>

      {/* Testimonials Section */}
      {/* {franchiseTestimonials.length > 0 && ( */}
      {/* <motion.section
        className="mb-20 py-12 bg-green-50 rounded-xl"
        variants={fadeIn("up", "spring", 0.4, 1)}
      >
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            What Our Partners Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeIn("up", "spring", index * 0.2, 1)}
                initial="hidden"
                animate="show"
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">
                  "{testimonial.quote}"
                </p>
                <p className="font-semibold text-gray-800">
                  {testimonial.name}
                </p>
                <p className="text-gray-500 text-sm">{testimonial.location}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section> */}
      {/* )} */}

      {/* Application Section */}
      <motion.section
        id="apply"
        className="scroll-mt-20"
        variants={staggerContainer(0.1, 0.3)}
      >
        <motion.div variants={fadeIn("up", "spring", 0.2, 1)}>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Partnership Application
          </h2>
          <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            Take the first step towards owning an Ishani Enterprises Partnership
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-md overflow-hidden max-w-4xl mx-auto mb-8"
          variants={fadeIn("up", "spring", 0.3, 1)}
        >
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Preferred City for Franchise *
                </label>
                <input
                  type="text"
                  id="city"
                  name="preferred_city"
                  value={formData.preferred_city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                  list="citiesList"
                />
                {/* <datalist id="citiesList">
                  {availableCities.map((city, index) => (
                    <option key={index} value={city} />
                  ))}
                </datalist> */}
              </div>

              <div>
                <label
                  htmlFor="investment"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Estimated Investment Capacity *
                </label>
                <select
                  id="investment"
                  name="investment_capacity"
                  value={formData.investment_capacity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select range</option>
                  <option value="10-20 lakhs">₹10-20 Lakhs</option>
                  <option value="20-30 lakhs">₹20-30 Lakhs</option>
                  <option value="30-40 lakhs">₹30-40 Lakhs</option>
                  <option value="40-50 lakhs">₹40-50 Lakhs</option>
                  <option value="50+ lakhs">₹50+ Lakhs</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="experience"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Relevant Business Experience *
                </label>
                <textarea
                  id="experience"
                  name="business_experience"
                  value={formData.business_experience}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Describe your experience in construction, retail, or related fields"
                  required
                ></textarea>
              </div>

              <div>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="consent_marketing"
                    checked={formData.consent_marketing}
                    onChange={handleChange}
                    className="mt-1 mr-2 rounded text-green-500 focus:ring-green-500"
                    required
                  />
                  <span className="text-sm text-gray-600">
                    I agree to receive more information about Ishani Enterprises
                    partnership opportunities
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitStatus === "submitting"}
                className={`w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-md transition-colors ${submitStatus === "submitting"
                  ? "opacity-70 cursor-not-allowed"
                  : ""
                  }`}
              >
                {submitStatus === "submitting" ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Submit Partnership Application"
                )}
              </button>
            </form>

            <div className="mt-4">
              {submitStatus === "submitting" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center p-4 bg-blue-50 rounded-md"
                >
                  <svg
                    className="w-5 h-5 text-blue-500 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span className="text-blue-700">
                    Submitting your request...
                  </span>
                </motion.div>
              )}

              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center p-4 bg-green-50 rounded-md"
                >
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <div>
                    <p className="font-medium text-green-700">
                      Thank you for your application!
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      We've received your partnership application and will
                      contact you shortly.
                    </p>
                  </div>
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 rounded-md"
                >
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-red-500 mr-3 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <div>
                      <p className="font-medium text-red-700">
                        There was an error submitting your form
                      </p>
                      <p className="text-sm text-red-600 mt-1">
                        {submitError || "Please try again later."}
                      </p>
                      <button
                        onClick={() => setSubmitStatus(null)}
                        className="mt-2 text-sm font-medium text-red-600 hover:text-red-700 focus:outline-none"
                      >
                        Try again →
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeIn("up", "spring", 0.4, 1)}
          className="text-center"
        >
          <p className="text-gray-600 mb-4">
            Want more details before applying?
          </p>

          {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            > */}
          {/* <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              /> */}
          {/* </svg> */}
          <a
            href={`${contactData?.social_link_5 || 'https://wa.me/918208095812'}?text=Hello%20there!`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg inline-flex items-center mb-2"
          >
            <FaWhatsapp /> <span className="ml-2">Contact for Partnership</span>
          </a>
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

export default FranchisePage;
