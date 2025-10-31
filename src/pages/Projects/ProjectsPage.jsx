import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiFilter, FiChevronDown } from "react-icons/fi";
import axios from "axios";
import AwardSection from "../Home/AwardSection";
import GallerySection from "../Home/GallerySection";

const ProjectsPage = () => {
  // const [activeLocation, setActiveLocation] = useState("All");
  // const [activeClientType, setActiveClientType] = useState("All");
  // const [showMobileFilters, setShowMobileFilters] = useState(false);
  // const [selectedProject, setSelectedProject] = useState(null);
  // const [projectsData, setProjectsData] = useState({
  //   projects: [],
  //   filters: {
  //     locations: ["All"],
  //     clientTypes: ["All"],
  //   },
  // });
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // // Fetch projects data from API
  // useEffect(() => {
  //   const fetchProjects = async () => {
  //     try {
  //       const response = await axios.get(
  //         "https://ishanib.demovoting.com/api/projects"
  //       );
  //       setProjectsData({
  //         projects: response.data.projects,
  //         filters: {
  //           locations: [
  //             "All",
  //             ...new Set(response.data.projects.map((p) => p.location)),
  //           ],
  //           clientTypes: [
  //             "All",
  //             ...new Set(response.data.projects.map((p) => p.client_type)),
  //           ],
  //         },
  //       });
  //       setLoading(false);
  //     } catch (err) {
  //       setError(err.message);
  //       setLoading(false);
  //     }
  //   };

  //   fetchProjects();
  // }, []);

  // // Filter projects
  // const filteredProjects = projectsData.projects.filter((project) => {
  //   const locationMatch =
  //     activeLocation === "All" || project.location === activeLocation;
  //   const clientMatch =
  //     activeClientType === "All" || project.client_type === activeClientType;
  //   return locationMatch && clientMatch;
  // });

  // // Toggle project detail view
  // const toggleProjectDetail = (project) => {
  //   setSelectedProject(selectedProject?.id === project.id ? null : project);
  //   window.history.pushState({}, "", `/projects/${project.seo_title}`);
  // };

  // if (loading) return <LoadingSpinner />;
  // if (error) return <ErrorDisplay message={error} />;

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 mt-20">
      <div>
        <AwardSection />
        <GallerySection />
      </div>
      {/* <div className="max-w-7xl mx-auto">
       
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Our Project Gallery
          </h1>
          <motion.div
            className="h-1 w-16 bg-green-500 mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: "4rem" }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
          <p className="text-gray-600 max-w-2xl mx-auto">
            See our transformations - quality installations across India
          </p>
        </motion.div>

     
        <motion.div
          className="hidden md:flex justify-center gap-6 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3">
            <span className="font-medium">Location:</span>
            {projectsData.filters.locations.map((location) => (
              <button
                key={location}
                onClick={() => setActiveLocation(location)}
                className={`px-4 py-2 rounded-full transition-all ${
                  activeLocation === location
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {location}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-medium">Client Type:</span>
            {projectsData.filters.clientTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveClientType(type)}
                className={`px-4 py-2 rounded-full transition-all ${
                  activeClientType === type
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </motion.div>

       
        <MobileFilterBar
          showMobileFilters={showMobileFilters}
          setShowMobileFilters={setShowMobileFilters}
          locations={projectsData.filters.locations}
          clientTypes={projectsData.filters.clientTypes}
          activeLocation={activeLocation}
          activeClientType={activeClientType}
          setActiveLocation={setActiveLocation}
          setActiveClientType={setActiveClientType}
        />

     
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isSelected={selectedProject?.id === project.id}
              onSelect={toggleProjectDetail}
            />
          ))}
        </div>

      
        {filteredProjects.length === 0 && (
          <EmptyState
            setActiveLocation={setActiveLocation}
            setActiveClientType={setActiveClientType}
          />
        )}

      
        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>*/}
    </section>
  );
};

// // Loading Spinner Component
// const LoadingSpinner = () => (
//   <div className="flex justify-center items-center min-h-[50vh]">
//     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
//   </div>
// );

// // Error Display Component
// const ErrorDisplay = ({ message }) => (
//   <div className="text-center py-16 text-red-500">
//     <p>Error loading projects: {message}</p>
//     <button
//       onClick={() => window.location.reload()}
//       className="mt-4 text-green-600 font-medium hover:text-green-700"
//     >
//       Try Again
//     </button>
//   </div>
// );

// // Mobile Filter Bar Component
// const MobileFilterBar = ({
//   showMobileFilters,
//   setShowMobileFilters,
//   locations,
//   clientTypes,
//   activeLocation,
//   activeClientType,
//   setActiveLocation,
//   setActiveClientType,
// }) => (
//   <div className="md:hidden mb-8">
//     <button
//       onClick={() => setShowMobileFilters(!showMobileFilters)}
//       className="flex items-center justify-center w-full max-w-xs mx-auto bg-green-500 text-white px-5 py-3 rounded-full shadow"
//     >
//       <FiFilter className="mr-2" />
//       <span>Filter Projects</span>
//       <FiChevronDown
//         className={`ml-2 transition-transform ${
//           showMobileFilters ? "rotate-180" : ""
//         }`}
//       />
//     </button>

//     {showMobileFilters && (
//       <motion.div
//         className="bg-white p-4 mt-2 rounded-lg shadow-lg"
//         initial={{ opacity: 0, height: 0 }}
//         animate={{ opacity: 1, height: "auto" }}
//         exit={{ opacity: 0, height: 0 }}
//       >
//         <div className="mb-4">
//           <h3 className="font-medium mb-2">Location</h3>
//           <div className="flex flex-wrap gap-2">
//             {locations.map((location) => (
//               <button
//                 key={location}
//                 onClick={() => {
//                   setActiveLocation(location);
//                   setShowMobileFilters(false);
//                 }}
//                 className={`px-3 py-1 text-sm rounded-full ${
//                   activeLocation === location
//                     ? "bg-green-500 text-white"
//                     : "bg-gray-100"
//                 }`}
//               >
//                 {location}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div>
//           <h3 className="font-medium mb-2">Client Type</h3>
//           <div className="flex flex-wrap gap-2">
//             {clientTypes.map((type) => (
//               <button
//                 key={type}
//                 onClick={() => {
//                   setActiveClientType(type);
//                   setShowMobileFilters(false);
//                 }}
//                 className={`px-3 py-1 text-sm rounded-full ${
//                   activeClientType === type
//                     ? "bg-green-500 text-white"
//                     : "bg-gray-100"
//                 }`}
//               >
//                 {type}
//               </button>
//             ))}
//           </div>
//         </div>
//       </motion.div>
//     )}
//   </div>
// );

// // Empty State Component
// const EmptyState = ({ setActiveLocation, setActiveClientType }) => (
//   <motion.div
//     className="text-center py-16"
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//   >
//     <p className="text-gray-500 text-lg">
//       No projects found with current filters.
//     </p>
//     <button
//       onClick={() => {
//         setActiveLocation("All");
//         setActiveClientType("All");
//       }}
//       className="mt-4 text-green-600 font-medium hover:text-green-700"
//     >
//       Reset filters
//     </button>
//   </motion.div>
// );

// // Project Card Component
// const ProjectCard = ({ project, isSelected, onSelect }) => (
//   <motion.div
//     whileHover={{ scale: 1.02 }}
//     whileTap={{ scale: 0.98 }}
//     className={`bg-white rounded-xl overflow-hidden shadow-md border transition-all ${
//       isSelected ? "ring-2 ring-green-500" : "border-gray-200"
//     }`}
//   >
//     <div className="relative">
//       <BeforeAfterSlider
//         beforeImage={`https://ishanib.demovoting.com/uploads/${project.before_image}`}
//         afterImage={`https://ishanib.demovoting.com/uploads/${project.after_image}`}
//       />
//       <span className="absolute top-3 left-3 bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded">
//         {project.location}
//       </span>
//     </div>

//     <div className="p-5">
//       <h3 className="text-xl font-bold text-gray-800 mb-1">{project.title}</h3>
//       <div className="flex items-center text-sm text-gray-500 mb-3">
//         <span className="bg-gray-100 px-2 py-1 rounded mr-2">
//           {project.client_type}
//         </span>
//         <span>{project.date}</span>
//       </div>

//       <button
//         onClick={() => onSelect(project)}
//         className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition"
//       >
//         {isSelected ? "Viewing Details" : "View Project"}
//       </button>
//     </div>
//   </motion.div>
// );

// // Before-After Slider Component
// const BeforeAfterSlider = ({ beforeImage, afterImage }) => {
//   const [sliderPosition, setSliderPosition] = useState(50);

//   return (
//     <div className="relative h-64 w-full overflow-hidden">
//       <img
//         src={afterImage}
//         alt="After installation"
//         className="absolute inset-0 w-full h-full object-cover"
//       />
//       <div
//         className="absolute inset-0 w-full h-full bg-gray-200"
//         style={{
//           clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
//         }}
//       >
//         <img
//           src={beforeImage}
//           alt="Before installation"
//           className="w-full h-full object-cover"
//         />
//       </div>
//       <div
//         className="absolute top-0 bottom-0 w-1 bg-green-500 cursor-ew-resize"
//         style={{ left: `${sliderPosition}%` }}
//         onMouseDown={(e) => {
//           e.preventDefault();
//           const handleMouseMove = (e) => {
//             const container = e.currentTarget.parentElement;
//             const rect = container.getBoundingClientRect();
//             const x = Math.min(Math.max(e.clientX - rect.left, rect.width), 0);
//             const percent = Math.min(Math.max((x / rect.width) * 100, 0), 100);
//             setSliderPosition(percent);
//           };

//           const handleMouseUp = () => {
//             document.removeEventListener("mousemove", handleMouseMove);
//             document.removeEventListener("mouseup", handleMouseUp);
//           };

//           document.addEventListener("mousemove", handleMouseMove);
//           document.addEventListener("mouseup", handleMouseUp);
//         }}
//       />
//     </div>
//   );
// };

// // Project Detail Modal Component
// const ProjectDetailModal = ({ project, onClose }) => (
//   <motion.div
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     exit={{ opacity: 0 }}
//     className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 "
//     onClick={onClose}
//   >
//     <motion.div
//       initial={{ scale: 0.9, y: 50 }}
//       animate={{ scale: 1, y: 0 }}
//       className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
//       onClick={(e) => e.stopPropagation()}
//     >
//       <div className="p-6">
//         <div className="flex justify-between items-start mb-4">
//           <h2 className="text-2xl font-bold text-gray-800">{project.title}</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             ✕
//           </button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//           <div>
//             <h3 className="font-medium text-gray-800 mb-2">Before</h3>
//             <img
//               src={`https://ishanib.demovoting.com/uploads/${project.before_image}`}
//               alt={`Before ${project.title}`}
//               className="w-full h-auto rounded-lg"
//             />
//           </div>
//           <div>
//             <h3 className="font-medium text-gray-800 mb-2">After</h3>
//             <img
//               src={`https://ishanib.demovoting.com/uploads/${project.after_image}`}
//               alt={`After ${project.title}`}
//               className="w-full h-auto rounded-lg"
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div>
//             <h3 className="font-medium text-gray-800 mb-2">Project Details</h3>
//             <p className="text-gray-600">{project.description}</p>

//             <div className="mt-4">
//               <h4 className="font-medium text-gray-800">Products Used:</h4>
//               <ul className="list-disc list-inside text-gray-600">
//                 {project.products_used.map((product, i) => (
//                   <li key={i}>{product}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h3 className="font-medium text-gray-800 mb-3">
//               Project Highlights
//             </h3>
//             <div className="space-y-3">
//               <div className="flex items-start">
//                 <span className="text-green-500 mr-2">✓</span>
//                 <span className="text-gray-600">
//                   Location: {project.location}
//                 </span>
//               </div>
//               <div className="flex items-start">
//                 <span className="text-green-500 mr-2">✓</span>
//                 <span className="text-gray-600">
//                   Client Type: {project.client_type}
//                 </span>
//               </div>
//               <div className="flex items-start">
//                 <span className="text-green-500 mr-2">✓</span>
//                 <span className="text-gray-600">
//                   Completion Date: {project.date}
//                 </span>
//               </div>
//             </div>

//             <div className="mt-6">
//               <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition">
//                 Get Similar Door Installed
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   </motion.div>
// );

export default ProjectsPage;
