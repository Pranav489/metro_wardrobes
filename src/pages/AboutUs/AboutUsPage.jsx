import React, { useEffect, useState, useMemo } from "react";
import parse, { domToReact } from "html-react-parser";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer, zoomIn } from "../../utils/motion";
import { useLocation } from "react-router-dom";

const BulletIcon = () => (
  <svg
    className="h-5 w-5 text-green-500 mr-2 mt-0.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const transform = (node) => {
  if (node.name === 'p') {
    return (
      <p className="text-gray-600 mb-4">
        {domToReact(node.children)}
      </p>
    );
  }

  if (node.name === 'li') {
    return (
      <li className="flex items-start text-gray-600 mb-4">
        <BulletIcon />
        <span>{domToReact(node.children)}</span>
      </li>
    );
  }
};

const AboutUsPage = () => {
  const location = useLocation();
  const [companyData, setCompanyData] = useState(null);
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://ishanib.demovoting.com/api/companyinformation');
        setCompanyData(response.data);
        setHtmlContent(response.data.manufacturing_facility_description)
      } catch (error) {
        // console.error("Error fetching company information:", error);
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

  if (loading) {
    return <div className="h-[600px] flex items-center justify-center text-gray-500">Loading...</div>;
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
          About Ishani Enterprises
        </h1>
        <div className="w-24 h-1 bg-green-500 mx-auto"></div>
      </motion.div>

      {/* Quick Navigation */}
      <motion.div
        variants={staggerContainer(0.1, 0.2)}
        className="flex flex-wrap justify-center gap-4 mb-16"
      >
        {[
          { label: "Company Overview", path: "#overview" },
          { label: "Vision & Mission", path: "#vision" },
          { label: "Manufacturing Facility", path: "#facility" },
          { label: "Team / Leadership", path: "#team" },
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

      {/* Company Overview Section */}
      <motion.section
        id="overview"
        className="mb-20 scroll-mt-20"
        variants={staggerContainer(0.1, 0.3)}
      >
        <motion.div
          className="flex flex-col md:flex-row gap-8 items-center"
          variants={fadeIn("up", "spring", 0.2, 1)}
        >
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Company Overview
            </h2>
            <div className="space-y-4 text-gray-600">
              <p dangerouslySetInnerHTML={{ __html: companyData.company_overview }} />
            </div>
          </div>
          <motion.div className="md:w-1/2" variants={zoomIn(0.4, 1)}>
            <img
              src={`https://ishanib.demovoting.com/uploads/${companyData.company_overview_image}`}
              alt="Ishani Enterprises Manufacturing Facility"
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Vision & Mission Section */}
      <motion.section
        id="vision"
        className="mb-20 py-10 bg-gray-50 rounded-xl px-8 scroll-mt-20"
        variants={fadeIn("up", "spring", 0.3, 1)}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our Vision & Mission
          </h2>

          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={staggerContainer(0.1, 0.2)}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md"
              variants={fadeIn("right", "spring", 0.2, 1)}
            >
              <div className="text-green-500 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
              <p className="text-gray-600">
                To be the most trusted manufacturer of premium French doors and
                windows in India, recognized for our elegant designs, superior
                craftsmanship, and commitment to sustainable manufacturing
                practices.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-md"
              variants={fadeIn("left", "spring", 0.4, 1)}
            >
              <div className="text-green-500 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
              <p className="text-gray-600">
                To redefine architectural elegance through innovative French
                door and window solutions that combine timeless design with
                modern functionality. We commit to using premium materials,
                precision engineering, and sustainable practices to deliver
                exceptional value to our customers.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Manufacturing Facility Section */}
      <motion.section
        id="facility"
        className="mb-20 scroll-mt-20"
        variants={staggerContainer(0.1, 0.3)}
      >
        <motion.h2
          className="text-3xl font-bold text-center text-gray-800 mb-12"
          variants={fadeIn("up", "spring", 0.1, 1)}
        >
          Our Manufacturing Facility
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-2 gap-8 mb-8"
          variants={fadeIn("up", "spring", 0.2, 1)}
        >
          <div>
            <h3 className="text-2xl font-semibold mb-4">
              {companyData.manufacturing_facility_header}
            </h3>
            {parse(htmlContent, { replace: transform })}
          </div>
          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={staggerContainer(0.1, 0.2)}
          >
            {companyData.manufacturing_facility_images?.map((image, index) => (
              <motion.img
              variants={zoomIn(0.1, 1)}
                key={index}
                src={`https://ishanib.demovoting.com/uploads/${image}`}
                alt={companyData.manufacturing_facility_images_alt?.[index]?.alt || ''}
                className="rounded-lg shadow-md h-full object-cover"
              />
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-green-50 p-6 rounded-lg border border-green-100"
          variants={fadeIn("up", "spring", 0.5, 1)}
        >
          <h3 className="text-xl font-semibold mb-3 text-green-800">
            Quality Assurance
          </h3>
          <p className="text-green-700">
            Every French door and window undergoes 27 quality checkpoints from
            raw material inspection to final packaging. Our quality assurance
            process includes stress testing, weatherproofing verification, and
            finish durability assessments to ensure products that stand the test
            of time.
          </p>
        </motion.div>
      </motion.section>

      {/* Team/Leadership Section */}
      <motion.section
        id="team"
        className="scroll-mt-20"
        variants={staggerContainer(0.1, 0.3)}
      >
        <motion.h2
          className="text-3xl font-bold text-center text-gray-800 mb-12"
          variants={fadeIn("up", "spring", 0.1, 1)}
        >
          Our Leadership Team
        </motion.h2>

        <motion.div
          className="flex flex-col md:flex-row gap-8"
          variants={staggerContainer(0.1, 0.2)}
        >
            {companyData.leadership_team?.map((data, index) => (

            <motion.div
              key={index}
              variants={fadeIn("up", "spring", index * 0.2, 0.75)}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={`https://ishanib.demovoting.com/uploads/${data.image}`}
                alt={data.image_alt}
                className="w-full h-64 object-contain"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">{data.name}</h3>
                <p className="text-green-600 font-medium mb-3">
                  {data.position}
                </p>
                <p className="text-gray-600 text-sm">{data.bio}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 bg-gray-50 p-8 rounded-xl"
          variants={fadeIn("up", "spring", 0.5, 1)}
        >
          <h3 className="text-2xl font-semibold text-center mb-6">
            Our Values
          </h3>
          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={staggerContainer(0.1, 0.2)}
          >
            {[
              {
                title: "Craftsmanship",
                description:
                  "We honor traditional woodworking techniques while embracing modern precision engineering.",
              },
              {
                title: "Elegance",
                description:
                  "Every French door we create embodies timeless architectural beauty.",
              },
              {
                title: "Precision",
                description:
                  "Millimeter-perfect joinery ensures flawless operation and durability.",
              },
              {
                title: "Sustainability",
                description:
                  "We source FSC-certified woods and use low-VOC finishes for eco-conscious manufacturing.",
              },
              {
                title: "Innovation",
                description:
                  "Continual improvement in hardware and insulation technologies.",
              },
              {
                title: "Client Partnership",
                description:
                  "From architects to homeowners, we collaborate to realize your vision.",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={fadeIn("up", "spring", index * 0.1, 1)}
                className="bg-white p-5 rounded-lg shadow-sm border border-gray-100"
              >
                <h4 className="font-semibold text-lg mb-2">{value.title}</h4>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

export default AboutUsPage;
