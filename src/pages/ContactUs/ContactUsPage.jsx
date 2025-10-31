import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer, zoomIn } from "../../utils/motion";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaWhatsapp,
  FaLinkedin,
} from "react-icons/fa";
import { MdOutlineEmail, MdOutlineFactory } from "react-icons/md";
import {
  IoLocationOutline,
  IoCallOutline,
  IoStorefrontOutline,
} from "react-icons/io5";

const ContactUsPage = () => {

  const [contactData, setContactData] = useState(null);
  const socialIcons = [
    {
      icon: FaFacebookF,
      label: "Facebook",
      url: contactData?.social_link_1 || "#"
    },
    {
      icon: FaLinkedin,
      label: "LinkedIn",
      url: contactData?.social_link_2 || "#"
    },
    {
      icon: FaYoutube,
      label: "YouTube",
      url: contactData?.social_link_3 || "#"
    },
    {
      icon: FaInstagram,
      label: "Instagram",
      url: contactData?.social_link_4 || "#"
    },
    {
      icon: FaWhatsapp,
      label: "WhatsApp",
      url: contactData?.social_link_5 ? `https://wa.me/918208095812` : "#"
    },
  ];

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://ishanib.demovoting.com/api/contact"
        );
        // console.log(response);
        setContactData(response.data || null);
      } catch (error) {
        console.error("Error fetching contact information:", error);
        setContactData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const subjectOptions = [
    "Product Inquiry",
    "Request a Quote",
    "Technical Support",
    "Schedule a Visit",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const validateForm = () => {
  //   const newErrors = {};

  //   if (!formData.full_name.trim()) newErrors.full_name = 'Full Name is required';
  //   if (!formData.email.trim()) {
  //     newErrors.email = 'Email is required';
  //   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
  //     newErrors.email = 'Email is invalid';
  //   }
  //   if (!formData.subject) newErrors.subject = 'Subject is required';

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!validateForm()) return;

    setSubmitStatus("sending");
    setSubmitError(null);

    try {
      const response = await axios.post(
        "https://ishanib.demovoting.com/api/contactform",
        formData,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSubmitStatus("success");
        setFormData({
          full_name: "",
          email: "",
          phone_number: "",
          subject: "",
          message: "",
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

  // if (submitSuccess) {
  //   return (
  //     <div className="success-message">
  //       <h3>Thank you for contacting us!</h3>
  //       <p>Your message has been submitted successfully.</p>
  //     </div>
  //   );
  // }

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center text-gray-500">
        Loading...
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
          Contact Ishani Enterprises
        </h1>
        <div className="w-24 h-1 bg-green-500 mx-auto"></div>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Get in touch with our team for inquiries, support, or to visit our
          facilities
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Contact Form */}
        <motion.div
          variants={fadeIn("right", "spring", 0.2, 1)}
          className="bg-white p-8 rounded-xl shadow-md"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Send Us a Message
          </h2>
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
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                id="name"
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
                name="email"
                value={formData.email}
                onChange={handleChange}
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                id="phone"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subject *
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                id="subject"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select a subject</option>
                {subjectOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                id="message"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitStatus === "sending"}
              className={`w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-md transition-colors ${submitStatus === "submitting"
                ? "opacity-70 cursor-not-allowed"
                : ""
                }`}
            >
              {submitStatus === "sending" ? (
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
                "Send Message"
              )}
            </button>
          </form>
          <div className="mt-4">
            {submitStatus === "sending" && (
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
                <span className="text-blue-700">Sending your message...</span>
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
                    Thank you for your message!
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    We've received your message and will contact you shortly.
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
                      There was an error sending your message
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
        </motion.div>

        {/* Right Column - Contact Info */}
        <motion.div variants={fadeIn("left", "spring", 0.2, 1)}>
          {/* Contact Details */}
          <div className="bg-gray-50 p-8 rounded-xl shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Contact Information
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <IoCallOutline size={24} className="text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Phone</h3>
                  <p className="text-gray-600">
                    {contactData?.tel_number || ""}
                  </p>
                  <p className="text-gray-600">
                    {contactData?.mobile_number || ""}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MdOutlineEmail size={24} className="text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Email</h3>
                  <p className="text-gray-600">{contactData?.email || ""}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaWhatsapp size={24} className="text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">WhatsApp</h3>
                  <a
                    href={`${contactData?.social_link_5 || '#'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-green-600"
                  >
                    {contactData?.whatsapp_number || ""}
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8">
              <h3 className="font-semibold text-gray-800 mb-4">
                Connect With Us
              </h3>
              <div className="flex gap-4">
                {socialIcons.map(({ icon: Icon, label, url }, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-3 rounded-full shadow-sm hover:bg-green-100 text-gray-600 hover:text-green-600 transition-colors"
                    title={label}
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <IoLocationOutline size={24} className="text-green-500" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Corporate Office
                </h3>
              </div>
              <address className="text-gray-600 not-italic pl-9">
                {contactData?.corporate_address_line1}
                <br />
                {contactData?.corporate_address_line2}
                <br />
                {contactData?.corporate_address_line3}
                <br />
                {contactData?.corporate_address_line4}
                <br />
                {contactData?.corporate_address_line5}
              </address>
            </div>

            {/* <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <MdOutlineFactory size={24} className="text-green-500" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Factory Address
                </h3>
              </div>
              <address className="text-gray-600 not-italic pl-9">
                {contactData?.factory_address_line1}
                <br />
                {contactData?.factory_address_line2}
                <br />
                {contactData?.factory_address_line3}
                <br />
                {contactData?.factory_address_line4}
                <br />
                {contactData?.factory_address_line5}
              </address>
            </div> */}

            {/* <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <IoStorefrontOutline size={24} className="text-green-500" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Outlet Address
                </h3>
              </div>
              <address className="text-gray-600 not-italic pl-9">
                {contactData?.outlet_address_line1}
                <br />
                {contactData?.outlet_address_line2}
                <br />
                {contactData?.outlet_address_line3}
                <br />
                {contactData?.outlet_address_line4}
                <br />
                {contactData?.outlet_address_line5}
              </address>
            </div> */}
          </div>
        </motion.div>
      </div>

      {/* Google Map Section */}
      <motion.section
        variants={fadeIn("up", "spring", 0.3, 1)}
        className="mt-16 bg-gray-50 rounded-xl overflow-hidden"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 px-8 pt-8">
          Our Locations
        </h2>
        <div className="grid grid-cols-1  gap-8 p-8">
          {/* Corporate Office Map */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Corporate Office
            </h3>
            <div className="h-64 bg-gray-200 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59996.38557342982!2d73.76746801612664!3d19.974045126605333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddeb3204dc31df%3A0x51309c622e9dd627!2sIshani%20Enterprises%20French%20Door%20Designer%20Studio!5e0!3m2!1sen!2sin!4v1747053705894!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Ishani Enterprises Corporate Office"
              />

            </div>
          </div>
        </div>

        {/* Schema Markup (invisible) */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Ishani Enterprises",
              "url": "https://www.ishanienterprises.com",
              "logo": "https://www.ishanienterprises.com/logo.png",
              "description": "Manufacturer of premium French doors and windows",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "G-8, Prestige Bytco Business Center, Bytco Point, Nasik Road",
                "addressLocality": "Nashik",
                "addressRegion": "Maharashtra",
                "postalCode": "422101",
                "addressCountry": "IN"
              },
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+912532465140",
                  "contactType": "customer service",
                  "email": "ishanient@gmail.com",
                  "areaServed": "IN"
                }
              ],
              "sameAs": [
                "https://www.facebook.com/ishanienterprises",
                "https://www.twitter.com/ishanient",
                "https://www.instagram.com/ishanienterprises",
                "https://www.youtube.com/ishanienterprises"
              ]
            }
          `}
        </script>
      </motion.section>
    </motion.div>
  );
};

export default ContactUsPage;
