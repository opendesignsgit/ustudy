import React from 'react'

// Array to hold card data
const sections = [
  {
    title: 'APPLICATION GUIDANCE',
    description:
      'Ustudy offers expert application guidance, ensuring your documents are accurate and submissions timely.',
    icon: '📄', // Replace with an actual icon or component
  },
  {
    title: 'VISA, FOREX',
    description:
      'Ustudy assists in obtaining the right student visa and ensures smooth foreign exchange transactions.',
    icon: '💳', // Replace with an actual icon or component
  },
  {
    title: 'TICKETING PROCESS',
    description:
      'We help ensure your travel aligns with your academic schedule and is as cost-effective as possible.',
    icon: '✈️', // Replace with an actual icon or component
  },
  {
    title: 'PRE-DEPARTURE COUNSELING',
    description:
      'Pre-departure counseling prepares you for life abroad, covering academic, cultural, and logistical aspects.',
    icon: '🗺️', // Replace with an actual icon or component
  },
  {
    title: "DOS AND DON'TS",
    description:
      "Ustudy's Dos and Don'ts guide ensures you are well-prepared for cultural and academic life abroad.",
    icon: '📖', // Replace with an actual icon or component
  },
  {
    title: 'ACCOMMODATION AREA',
    description: "We help you choose a location that's safe, convenient, and within your budget.",
    icon: '🏠', // Replace with an actual icon or component
  },
  {
    title: 'POST LANDING FORMALITIES',
    description:
      'We ensure you complete all required formalities smoothly after you arrive in your destination country.',
    icon: '📋', // Replace with an actual icon or component
  },
  {
    title: 'FINANCIAL GUIDANCE',
    description:
      'Ustudy provides expert financial guidance to help manage your budget and find scholarships.',
    icon: '💰', // Replace with an actual icon or component
  },
  {
    title: 'GUIDED HANDS ON PROJECTS',
    description:
      'Ustudy offers guided hands-on projects that provide practical experience alongside your academic studies.',
    icon: '💡', // Replace with an actual icon or component
  },
]

const UniversitySolutionSection = () => {
  return (
    <section className="halinonesec secpadblock bg-[#0056D2] relative">
      {/* Section Heading */}
      <div className="container relative">
        <div className="sectitle marbtm textcenter whitetext">
          <h2>
            All-in-One University Solution <br />
            through Ustudy Global
          </h2>
          <p>
            A complete system covering admissions, education, <br />
            facilities, and student support.
          </p>
        </div>

        {/* Cards Grid */}
        {/* Top Row: Five Cards */}
        <div className="flex flex-wrap justify-center halinoneBox">
          {sections.slice(0, 9).map((section, index) => (
            <div
              key={index}
              className="bg-white halinoneItems relative"
              style={{
                backgroundImage: `url("/path-to-pattern.svg")`, // Replace with your pattern image URL
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }}
            >
              {/* Icon in a Circle */}
              <div className="halinoneicon absolute rounded-full flex items-center justify-center">
                <span className="text-2xl">{section.icon}</span>
              </div>
              {/* Title */}
              <h3>{section.title}</h3>
              {/* Description */}
              <p>{section.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UniversitySolutionSection
