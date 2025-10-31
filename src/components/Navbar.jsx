import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ContentWrapper from "./ContentWrapper/ContentWrapper";
import { navlogo } from "../../public/assets";

const Navbar = ({ categories }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [hideTopBar, setHideTopBar] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = (index) =>
    setOpenDropdown(openDropdown === index ? null : index);

  useEffect(() => {
    const handleScroll = () => {
      setHideTopBar(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // console.log(categories);
  const generatePath = (name) => {
    return name.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
  };
  const navItems = [
    { label: "HOME", path: "/" },
    {
      label: "ABOUT US",
      submenu: [
        { label: "Company Overview", path: "/aboutus#overview" },
        { label: "Vision & Mission", path: "/aboutus#vision" },
        { label: "Manufacturing Facility", path: "/aboutus#facility" },
        { label: "Team / Leadership", path: "/aboutus#team" },
      ],
    },
    {
      label: "SERVICES",
      submenu: [
        ...categories?.map((category) => ({
          label: category.name,
          path: `/products/${generatePath(category.name)}`,
        })),
        { label: "All Products", path: "/products" },
      ],
    },
    {
      label: "GALLERY",
      // submenu: [
      //   { label: "Residential Installations", path: "/gallery/residential" },
      //   { label: "Commercial Projects", path: "/gallery/commercial" },
      //   { label: "Before & After Showcase", path: "/gallery/showcase" },
      // ],
      path: "/gallery",
    },
    {
      label: "VISIT FACTORY OUTLET",
      // submenu: [
      //   { label: "Showroom Images", path: "/factory-outlet/showroom-images" },
      //   { label: "Map & Directions", path: "/factory-outlet/map" },
      //   { label: "Book a Visit", path: "/factory-outlet/book-visit" },
      // ],
      path: "/factory-outlet",
    },
    {
      label: "PARTNERSHIP OPPORTUNITY",
      // submenu: [
      //   { label: "Why Partner with Us", path: "/franchise/why-partner" },
      //   { label: "Franchise Benefits", path: "/franchise/benefits" },
      //   { label: "Cities Available", path: "/franchise/cities" },
      //   { label: "Apply Now", path: "/franchise/apply" },
      // ],
      path: "/ishani-partnership",
    },
    {
      label: "BLOG",
      // submenu: [
      //   { label: "Design Tips", path: "/blog/design-tips" },
      //   { label: "French Door Maintenance", path: "/blog/maintenance" },
      //   { label: "Industry News", path: "/blog/news" },
      //   { label: "FAQs", path: "/blog/faqs" },
      // ],
      path: "/blog",
    },
    { label: "CONTACT US", path: "/contactus" },
  ];

  return (
    <header className="relative z-40">
      {/* Top Contact Bar - Updated to yellow/gray theme */}
      <div
        className={`bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 text-sm px-4 md:px-10 transition-transform duration-500 ${
          hideTopBar ? "-translate-y-full" : "translate-y-0"
        } fixed top-0 left-0 w-full z-[100]`}
      >
        <ContentWrapper>
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-4">
              <a
                href="mailto:ishanient@gmail.com"
                className="hover:text-green-400 text-xs md:text-md transition-colors flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                ishanient@gmail.com
              </a>
              <a
                href="tel:+919421800066"
                className="hover:text-green-400 text-xs md:text-md  transition-colors flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
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
                +91 9421800066
              </a>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-green-400">Open Hours:</span>
              <span>Mon-Sat: 9:00 AM - 6:00 PM</span>
            </div>
          </div>
        </ContentWrapper>
      </div>

      {/* Main Navbar - Updated to yellow/gray/white theme */}
      <nav
        className="fixed w-full left-0 transition-all duration-300 z-[90] shadow-sm bg-white"
        style={{ top: hideTopBar ? "0" : "30px" }}
      >
        <ContentWrapper>
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <div onClick={() => navigate("/")} className="cursor-pointer">
              <img src={navlogo} alt="logo" className="h-12 w-auto" />
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex space-x-6 font-medium text-gray-800 relative">
              {navItems.map((item, index) => (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => item.submenu && toggleDropdown(index)}
                  onMouseLeave={() => item.submenu && toggleDropdown(null)}
                >
                  <button
                    onClick={() =>
                      item.submenu ? toggleDropdown(index) : navigate(item.path)
                    }
                    className={`hover:text-green-600 flex items-center gap-1 transition-colors ${
                      openDropdown === index ? "text-green-600" : ""
                    }`}
                  >
                    {item.label}
                    {item.submenu && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          openDropdown === index ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* Desktop Dropdown */}
                  <AnimatePresence>
                    {openDropdown === index && item.submenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-10 left-0 bg-white rounded-lg shadow-xl py-2 px-3 min-w-[220px] z-[120] border border-gray-100"
                      >
                        {item.submenu.map((subItem, subIndex) => (
                          <motion.div
                            key={subIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: subIndex * 0.05 }}
                            onClick={() => navigate(subItem.path)}
                            className="hover:bg-green-50 px-3 py-2 rounded text-sm text-gray-700 cursor-pointer transition-colors hover:text-green-600"
                          >
                            {subItem.label}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-800 hover:text-green-600 pr-5 transition-colors"
              >
                {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </ContentWrapper>
      </nav>

      {/* Mobile Menu - Updated to yellow/gray/white theme */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4 }}
            className="fixed top-0 right-0 w-3/4 max-w-sm h-full bg-white z-[110] shadow-xl p-6 space-y-4 overflow-y-auto"
          >
            <button
              onClick={toggleMenu}
              className="absolute top-4 right-4 text-gray-800 hover:text-green-600"
            >
              <X size={28} />
            </button>

            <div className="mt-10 space-y-6">
              {navItems.map((item, index) => (
                <div key={index} className="border-b border-gray-100 pb-4">
                  <button
                    onClick={() => {
                      if (!item.submenu) {
                        navigate(item.path);
                        toggleMenu();
                      }
                    }}
                    className={`w-full text-left font-semibold text-lg ${
                      item.submenu
                        ? "text-gray-900"
                        : "text-gray-800 hover:text-green-600"
                    } py-2 flex justify-between items-center`}
                  >
                    {item.label}
                    {item.submenu && (
                      <ChevronDown
                        size={20}
                        className={`transition-transform ${
                          openDropdown === index ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                  {/* Mobile Submenu */}
                  {item.submenu && (
                    <div className="ml-4 space-y-2 mt-2">
                      {item.submenu.map((sub, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => {
                            navigate(sub.path);
                            toggleMenu();
                          }}
                          className="pl-3 py-2 text-gray-700 hover:text-green-600 cursor-pointer flex items-center"
                        >
                          <span className="text-green-500 mr-2">•</span>
                          {sub.label}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Contact Info */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
              <a
                href="mailto:ishanient@gmail.com

"
                className="text-gray-700 hover:text-green-600 flex items-center mb-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                ishanient@gmail.com
              </a>
              <a
                href="tel:+919053211211"
                className="text-gray-700 hover:text-green-600 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
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
                +91 9053211211
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
