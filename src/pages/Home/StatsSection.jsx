import { useRef, useState, useEffect } from "react";
import CountUp from "react-countup";
import { motion, useInView } from "framer-motion";
import * as LucideIcons from "lucide-react";
import axios from "axios";

const iconNameMap = {
  "Calender": "Calendar",
};

const StatsSection = () => {
  const sectionRef = useRef(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // More reliable visibility detection with larger threshold
  const isInView = useInView(sectionRef, {
    once: true,
    margin: "0px 0px -50px 0px",
    amount: 0.1 // Require at least 10% of element to be visible
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("https://ishanib.demovoting.com/api/stats");
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Fallback animation trigger if intersection observer fails
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasAnimated) {
        setHasAnimated(true);
      }
    }, 1000); // 1 second fallback

    return () => clearTimeout(timer);
  }, [hasAnimated]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Determine whether to animate
  const shouldAnimate = isInView || hasAnimated;

  if (loading) {
    return (
      <section className="py-16 bg-gray-50" id="stats">
        <div className="container mx-auto px-4 text-center">
          Loading statistics...
        </div>
      </section>
    );
  }

  return (
    <section 
      className="py-16 bg-gray-50" 
      id="stats"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
        >
          {stats.map((stat) => {
            const correctedIconName = iconNameMap[stat.icon] || stat.icon;
            const IconComponent = LucideIcons[correctedIconName] || LucideIcons["HelpCircle"];
            
            return (
              <motion.div
                key={stat.id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.03 }}
              >
                <div className="mb-4 text-blue-600 bg-blue-50 p-3 rounded-full">
                  <IconComponent className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">
                  {shouldAnimate ? (
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={stat.duration || 2}
                      suffix={stat.suffix || ""}
                    />
                  ) : (
                    <>0{stat.suffix}</>
                  )}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;