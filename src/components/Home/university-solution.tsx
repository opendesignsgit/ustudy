import React from "react";

// Array to hold card data
const sections = [
  {
    title: "APPLICATION GUIDANCE",
    description:
      "Ustudy offers expert application guidance, ensuring your documents are accurate and submissions timely.",
    icon: "📄", // Replace with an actual icon or component
  },
  {
    title: "VISA, FOREX",
    description:
      "Ustudy assists in obtaining the right student visa and ensures smooth foreign exchange transactions.",
    icon: "💳", // Replace with an actual icon or component
  },
  {
    title: "TICKETING PROCESS",
    description:
      "We help ensure your travel aligns with your academic schedule and is as cost-effective as possible.",
    icon: "✈️", // Replace with an actual icon or component
  },
  {
    title: "PRE-DEPARTURE COUNSELING",
    description:
      "Pre-departure counseling prepares you for life abroad, covering academic, cultural, and logistical aspects.",
    icon: "🗺️", // Replace with an actual icon or component
  },
  {
    title: "DOS AND DON'TS",
    description:
      "Ustudy's Dos and Don'ts guide ensures you are well-prepared for cultural and academic life abroad.",
    icon: "📖", // Replace with an actual icon or component
  },
  {
    title: "ACCOMMODATION AREA",
    description:
      "We help you choose a location that's safe, convenient, and within your budget.",
    icon: "🏠", // Replace with an actual icon or component
  },
  {
    title: "POST LANDING FORMALITIES",
    description:
      "We ensure you complete all required formalities smoothly after you arrive in your destination country.",
    icon: "📋", // Replace with an actual icon or component
  },
  {
    title: "FINANCIAL GUIDANCE",
    description:
      "Ustudy provides expert financial guidance to help manage your budget and find scholarships.",
    icon: "💰", // Replace with an actual icon or component
  },
  {
    title: "GUIDED HANDS ON PROJECTS",
    description:
      "Ustudy offers guided hands-on projects that provide practical experience alongside your academic studies.",
    icon: "💡", // Replace with an actual icon or component
  },
];

const UniversitySolutionSection = () => {
  return (
    <div className="bg-blue-900 text-white py-16 px-6">
      {/* Section Heading */}
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold">
          All-in-One University Solution through Ustudy Global
        </h1>
        <p className="mt-4 text-xl">
          A complete system covering admissions, education, facilities, and
          student support.
        </p>
      </div>

      {/* Cards Grid */}
      {/* Top Row: Five Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-12">
        {sections.slice(0, 5).map((section, index) => (
          <div
            key={index}
            className="bg-white text-blue-900 rounded-lg shadow-lg p-6 flex flex-col justify-between relative transition-transform transform hover:scale-105 h-64"
            style={{
              backgroundImage: `url("/path-to-pattern.svg")`, // Replace with your pattern image URL
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            {/* Icon in a Circle */}
            <div className="absolute top-4 right-4 bg-blue-100 text-blue-900 rounded-full w-12 h-12 flex items-center justify-center shadow-md">
              <span className="text-2xl">{section.icon}</span>
            </div>
            {/* Title */}
            <h2 className="text-lg font-bold mb-2">{section.title}</h2>
            {/* Description */}
            <p className="text-sm">{section.description}</p>
          </div>
        ))}
      </div>

      {/* Bottom Row: Four Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {sections.slice(5).map((section, index) => (
          <div
            key={index}
            className="bg-white text-blue-900 rounded-lg shadow-lg p-6 flex flex-col justify-between relative transition-transform transform hover:scale-105 h-64"
            style={{
              backgroundImage: `url("/path-to-pattern.svg")`, // Replace with your pattern image URL
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            {/* Icon in a Circle */}
            <div className="absolute top-4 right-4 bg-blue-100 text-blue-900 rounded-full w-12 h-12 flex items-center justify-center shadow-md">
              <span className="text-2xl">{section.icon}</span>
            </div>
            {/* Title */}
            <h2 className="text-lg font-bold mb-2">{section.title}</h2>
            {/* Description */}
            <p className="text-sm">{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UniversitySolutionSection;