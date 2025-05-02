"use client"
import React, { useState, useEffect, useRef } from "react";
import CountUp from "react-countup";

const StatCard = ({ number, label, description, shouldAnimate }) => {
  return (
    <div className="border border-gray-200 bg-white p-6 rounded-lg shadow-md relative z-10">
      <h2 className="text-5xl font-bold" style={{ color: "#0056D2" }}>
        {shouldAnimate ? (
          <CountUp start={0} end={number} duration={2.5} />
        ) : (
          `${number}+`
        )}
      </h2>
      <h3 className="text-xl font-semibold mt-2" style={{ color: "#0056D2" }}>
        {label}
      </h3>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
};

const WhyChooseUs = () => {
  const [animate, setAnimate] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimate(true);
          } else {
            setAnimate(false);
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const stats = [
    {
      number: 70,
      label: "Courses",
      description:
        "Explore a wide range of industry-ready courses from beginner to expert level. Each program is designed to build your knowledge and real-world skills.",
    },
    {
      number: 17,
      label: "Institution Partners",
      description:
        "Partnered with leading institutions like BAC, Veritas, and more. Gain access to recognized certifications and career opportunities.",
    },
    {
      number: 95,
      label: "Flexible Learning",
      description:
        "Choose flexible online or offline learning that fits your schedule. Study anytime, anywhere—your learning, your pace.",
    },
    {
      number: 140,
      label: "Expert Instructors",
      description:
        "Learn directly from industry professionals with hands-on experience. Get personalized support to help you succeed in your career.",
    },
  ];

  return (
    <section
      className="relative text-center py-16 px-4"
      ref={sectionRef} // Attach the ref to the section
    >
      {/* Background Logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="/path-to-background-logo.png" // Replace with your logo image path
          alt="Background Logo"
          className="w-3/4 md:w-1/2 opacity-10 absolute"
        />
      </div>

      {/* Content */}
      <h1 className="text-3xl font-bold mb-10 relative z-10" style={{ color: "#0056D2" }}>
        Why Choose Us
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            number={stat.number}
            label={stat.label}
            description={stat.description}
            shouldAnimate={animate} // Pass the animate state
          />
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;