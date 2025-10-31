import React, { useEffect, useState } from "react";
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram, FaLinkedin } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { IoLocationOutline, IoCallOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { navlogo } from "../../public/assets";
import axios from "axios";

const Footer = () => {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

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
  ];



  if (loading) {
    return (
      <div className="bg-gray-100 text-gray-800 pt-16 pb-8 px-6 md:px-16 rounded-t-3xl shadow-inner">
        <div className="max-w-7xl mx-auto text-center py-8">
          Loading footer data...
        </div>
      </div>
    );
  }




  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gray-100 text-gray-800 pt-16 pb-8 px-6 md:px-16 rounded-t-3xl shadow-inner"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Section - Contact */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <img
            src={navlogo}
            alt="Ishani Enterprises Logo"
            className="mb-6 w-40"
          />
          <h3 className="text-xl font-semibold mb-3 text-green-500 flex items-center gap-2">
            <IoCallOutline size={20} className="text-green-500" />
            Contact Us
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            Got something to say? Please drop us a line.
          </p>
          <ul className="text-sm text-gray-700 space-y-3">
            <li className="flex items-start gap-2">
              <IoLocationOutline size={20} className="text-green-500 mt-1" />
              <span>
                <strong>Corp. Office:</strong>
                <br />
                {contactData?.corporate_address_line1}
                <br />
                {contactData?.corporate_address_line2}
                <br />
                {contactData?.corporate_address_line3}
                <br />
                {contactData?.corporate_address_line4}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <MdOutlineEmail size={20} className="text-green-500" />
              {contactData?.email || ""}
            </li>
            <li className="flex items-center gap-2">
              <IoCallOutline size={20} className="text-green-500" />
              {contactData?.tel_number || ""}  |  {contactData?.mobile_number || ""}
            </li>
          </ul>
        </motion.div>

        {/* Right Section - Social */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold mb-4 text-green-500">
            Stay Connected
          </h3>
          <ul className="text-sm text-gray-700 space-y-2 mb-6">
            <li>Google: Keep up to date with news & announcements</li>
            <li>Facebook: See our latest portfolio & gallery</li>
            <li>LinkedIn: Connect with us & explore professional insights</li>
            <li>YouTube: Watch our videos & success stories</li>
          </ul>
          <div className="flex gap-6 mt-4">
            {socialIcons.map(({ icon: Icon, label, url }, index) => (
              <motion.a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
                title={label}
                className="bg-white p-3 rounded-full shadow-sm hover:bg-green-100 text-gray-600 hover:text-green-600"
              >
                <Icon size={20} />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-12 text-center text-sm text-gray-600 border-t border-gray-300 pt-4">
        <p>
          © 2025{" "}
          <span className="font-semibold text-gray-800">
            Ishani Enterprises
          </span>
          . All Rights Reserved by{" "}
          <span className="font-bold text-green-500">
            Rich System Solution
          </span>
          .{" "}
          <a href="#" className="text-green-600 hover:underline">
            Privacy Policy
          </a>{" "}
          |{" "}
          <a href="#" className="text-green-600 hover:underline">
            Security Policy
          </a>
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
