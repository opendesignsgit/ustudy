import Image from 'next/image'
import React from 'react'

// Array to hold card data
const sections = [
  {
    title: 'COUNSELING AND GUIDANCE',
    description:
      'Ustudy provides personalized counseling and guidance to help you choose the right academic and career path.',
    icon: '/media/home/hser-cg-icon.png', // Replace with an actual icon or component
  },
  {
    title: 'APPLICATION GUIDANCE',
    description:
      'Ustudy offers expert application guidance, ensuring your documents are accurate and submissions timely.',
    icon: '/media/home/hser-ag-icon.png', // Replace with an actual icon or component
  },
  {
    title: 'VISA, FOREX',
    description:
      'Ustudy assists in obtaining the right student visa and ensures smooth foreign exchange transactions.',
    icon: '/media/home/hser-vf-icon.png', // Replace with an actual icon or component
  },
  {
    title: 'TICKETING PROCESS',
    description:
      'Ustudy offers guidance in booking flights for students traveling abroad for their education.',
    icon: '/media/home/hser-tp-icon.png', // Replace with an actual icon or component
  },
  {
    title: 'PRE-DEPARTURE COUNSELING',
    description:
      'Pre-departure counseling prepares you for life abroad, covering academic, cultural, and logistical aspects.',
    icon: '/media/home/hser-pdc-icon.png', // Replace with an actual icon or component
  },
  {
    title: "DOS AND DON'TS",
    description:
      'Ustudy’s Dos and Don’ts guide ensures you are well-prepared for cultural and academic life abroad.',
    icon: '/media/home/hser-dd-icon.png', // Replace with an actual icon or component
  },
  {
    title: 'ACCOMMODATION AREA',
    description:
      'Ustudy assists in finding the right accommodation, whether on-campus or off-campus, for a comfortable living experience.',
    icon: '/media/home/hser-aa-icon.png', // Replace with an actual icon or component
  },
  {
    title: 'POST LANDING FORMALITIES',
    description:
      'Ustudy provides support for post-landing formalities, including immigration and orientation.',
    icon: '/media/home/hser-plf-icon.png', // Replace with an actual icon or component
  },
  {
    title: 'FINANCIAL GUIDANCE',
    description:
      'Ustudy provides expert financial guidance to help manage your budget and find scholarships.',
    icon: '/media/home/hser-fg-icon.png', // Replace with an actual icon or component
  },
  {
    title: 'GUIDED HANDS ON PROJECTS',
    description:
      'Ustudy offers guided hands-on projects that provide practical experience alongside your academic studies.',
    icon: '/media/home/hser-ghp-icon.png', // Replace with an actual icon or component
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
          {sections.slice(0, 10).map((section, index) => (
            <div key={index} className="bg-white halinoneItems relative">
              {/* Icon in a Circle */}
              <div className="halinoneicon absolute rounded-full flex items-center justify-center">
                <Image src={section.icon} alt={section.title} width="60" height="60" />
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
