import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Star,
  Users,
  TrendingUp,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const FranchiseHighlight = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Proven Business Model",
      description:
        "Leverage our established brand and successful operational systems",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Exclusive Territory",
      description: "Protected geographical area for your franchise operations",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Premium Brand Value",
      description: "Associate with Maharashtra's leading door/window brand",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Training & Support",
      description: "Comprehensive onboarding and ongoing business support",
    },
  ];

  return (
    <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-3">
            Become an Ishani Enterprises Partner
          </h2>
          <motion.div
            className="h-1 w-16 bg-green-500 mx-auto mb-6"
            initial={{ width: 0 }}
            whileInView={{ width: "4rem" }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true }}
          />
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join Maharashtra's fastest growing premium doors and windows network
            with our lucrative Partnership opportunity
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
              }}
            >
              <div className="text-green-600 mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 md:p-12 text-white overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="text-center md:text-left md:flex items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">
                  Ready to Start Your Partnership Journey?
                </h3>
                <p className="text-yellow-100">
                  Limited partnership opportunities available in select
                  Maharashtra districts
                </p>
              </div>
              <a
                onClick={() => {
                  navigate(`/ishani-partnership`);
                }}
                className="mt-6 md:mt-0 inline-flex items-center justify-center gap-2 bg-white text-green-700 hover:bg-gray-100 font-bold px-8 py-4 rounded-lg transition-all"
              >
                Apply for Partnership
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Decorative elements */}
          {/* <motion.div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-yellow-500/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-yellow-500/20"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          /> */}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="mt-12 bg-white p-6 rounded-xl shadow-sm max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-green-600">
              <Check className="w-5 h-5" />
              <span className="font-medium">
                Minimum Investment: ₹15-20 lakhs
              </span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
            <div className="flex items-center gap-2 text-green-600">
              <Check className="w-5 h-5" />
              <span className="font-medium">ROI: 18-24 months</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FranchiseHighlight;
