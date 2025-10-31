import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer, zoomIn } from "../../utils/motion";

const FactoryOutletPage = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [contactItems, setContactItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    preferred_date: "",
    preferred_time: "",
    special_requests: "",
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response1, response2] = await Promise.all([
          axios.get("https://ishanib.demovoting.com/api/showroomgallery"),
          axios.get("https://ishanib.demovoting.com/api/contact"),
        ]);
        setGalleryItems(response1.data.data ?? []);
        setContactItems(response2?.data ?? []);
      } catch (err) {
        setError(err?.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        // Small timeout to ensure component has rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("submitting");
    setSubmitError(null);

    try {
      const response = await axios.post(
        "https://ishanib.demovoting.com/api/visit-requests",
        formData,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      // console.log(response?.data);
      if (response.status >= 200 && response.status < 300) {
        setSubmitStatus("success");
        setFormData({
          full_name: "",
          email: "",
          phone_number: "",
          preferred_date: "",
          preferred_time: "",
          special_requests: "",
        });
      } else {
        throw new Error(response.data?.message || "Submission failed");
      }
    } catch (err) {
      // console.error(err);
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

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Error loading data: {error}
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
          Visit Our Nashik Display Outlet
        </h1>
        <div className="w-24 h-1 bg-green-500 mx-auto"></div>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Experience the Ishani difference firsthand at our Nashik corporate
          office and showroom
        </p>
      </motion.div>

      {/* Quick Navigation */}
      <motion.div
        variants={staggerContainer(0.1, 0.2)}
        className="flex flex-wrap justify-center gap-4 mb-16"
      >
        {[
          { label: "Showroom", path: "#showroom-images" },
          { label: "Location", path: "#map" },
          { label: "Book a Visit", path: "#book-visit" },
        ].map((item, index) => (
          <motion.div
            key={index}
            variants={fadeIn("right", "spring", index * 0.2, 0.75)}
          >
            <Link
              to={item.path}
              className="px-4 py-2 bg-gray-100 hover:bg-green-500 hover:text-white rounded-md transition-colors"
            >
              {item.label}
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Showroom Section */}
      <motion.section
        id="showroom-images"
        className="mb-20 scroll-mt-20"
        variants={staggerContainer(0.1, 0.3)}
      >
        <motion.div variants={fadeIn("up", "spring", 0.2, 1)}>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Our Nashik Showroom Gallery
          </h2>
          <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            Explore our extensive collection of premium French doors and windows
            displayed in our beautifully designed Nashik showroom
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer(0.1, 0.2)}
        >
          {galleryItems.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeIn("up", "spring", item * 0.1, 1)}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={`https://ishanib.demovoting.com/uploads/${item.src}`}
                alt={item.alt}
                className="w-full h-64 "
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Location Section */}
      <motion.section
        id="map"
        className="mb-20 py-10 bg-gray-50 rounded-xl px-8 scroll-mt-20"
        variants={fadeIn("up", "spring", 0.3, 1)}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeIn("up", "spring", 0.2, 1)}>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Nashik Location & Directions
            </h2>
            <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
              Visit us at our conveniently located corporate office and showroom
              in Nashik
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8 items-center"
            variants={staggerContainer(0.1, 0.2)}
          >
            <motion.div variants={fadeIn("right", "spring", 0.3, 1)}>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Nashik Corporate Office Address
                </h3>
                <address className="text-gray-600 not-italic space-y-2">
                  <p className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {contactItems.corporate_address_line1}
                    <br />
                    {contactItems.corporate_address_line2}
                    <br />
                    {contactItems.corporate_address_line3}
                    <br />
                    {contactItems.corporate_address_line4}
                    <br />
                    {contactItems.corporate_address_line5}
                  </p>
                  <p className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {contactItems.open_hours}
                  </p>
                  <p className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Phone: {contactItems.tel_number}
                    <br />
                    Mobile: {contactItems.mobile_number}
                    <br />
                    Email: {contactItems.email}
                  </p>
                </address>

                <div className="mt-6">
                  <h4 className="font-semibold mb-2 text-gray-800">
                    How to Reach Us in Nashik
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <strong>By Road:</strong> {contactItems.by_road}
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <strong>Parking:</strong> {contactItems.parking}
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <strong>Public Transport:</strong>{" "}
                      {contactItems.public_transport}
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div variants={zoomIn(0.4, 1)} className="h-full">
              <div className="bg-gray-200 rounded-lg overflow-hidden h-full min-h-[400px] relative">
                {/* Embedded Google Map */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.9510222861772!2d73.7996852!3d19.9685619!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddeb3204dc31df%3A0x51309c622e9dd627!2sIshani%20Enterprises%20French%20Door%20Designer%20Studio!5e0!3m2!1sen!2sin!4v1751959150748!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Ishani Enterprises Nashik Location"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Booking Section */}
      <motion.section
        id="book-visit"
        className="scroll-mt-20"
        variants={staggerContainer(0.1, 0.3)}
      >
        <motion.div variants={fadeIn("up", "spring", 0.2, 1)}>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Book Your Nashik Showroom Visit
          </h2>
          <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            Schedule your personalized showroom tour with our Nashik design
            experts
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-md overflow-hidden max-w-4xl mx-auto"
          variants={fadeIn("up", "spring", 0.3, 1)}
        >
          <div className="grid md:grid-cols-2">
            <div className="bg-green-50 p-8 md:p-12">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Nashik Visit Information
              </h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-500 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <strong className="text-gray-800">Duration:</strong>{" "}
                    Approximately 60-90 minutes
                  </div>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-500 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <div>
                    <strong className="text-gray-800">What to Expect:</strong>{" "}
                    Product demonstrations, material samples, and one-on-one
                    consultation about our French doors and windows
                  </div>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-500 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <div>
                    <strong className="text-gray-800">COVID-19 Safety:</strong>{" "}
                    Masks required, sanitization stations available, limited
                    capacity
                  </div>
                </li>
              </ul>
            </div>

            <div className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

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
                    onChange={handleInputChange}
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
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Preferred Visit Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="preferred_date"
                    value={formData.preferred_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="time"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Preferred Time *
                  </label>
                  <select
                    id="time"
                    name="preferred_time"
                    value={formData.preferred_time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="">Select a time slot</option>
                    <option value="09:00-11:00">
                      Morning (9:00 AM - 11:00 AM)
                    </option>
                    <option value="11:00-13:00">
                      Late Morning (11:00 AM - 1:00 PM)
                    </option>
                    <option value="13:00-15:00">
                      Afternoon (1:00 PM - 3:00 PM)
                    </option>
                    <option value="15:00-17:00">
                      Late Afternoon (3:00 PM - 5:00 PM)
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Special Requests
                  </label>
                  <textarea
                    id="notes"
                    name="special_requests"
                    value={formData.special_requests}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitStatus === "submitting"}
                  className={`w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors ${
                    submitStatus === "submitting"
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
                    "Book Your Nashik Visit"
                  )}
                </button>
              </form>

              {/* Form Submission Messages */}
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
                        Thank you for your request!
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        We've received your booking details and will contact you
                        shortly to confirm your visit.
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
          </div>
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

export default FactoryOutletPage;
