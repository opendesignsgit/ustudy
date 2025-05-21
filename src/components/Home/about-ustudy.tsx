import React from 'react'

const AboutUstudy = () => {
  return (
    <section className="relative hAbotintrosec">
      {/* Large Background Text */}
      <div className="hAbotintrobg">
        <img src="/media/home/HintroSecbg.jpg" alt="" />
      </div>
      <div className="hAbotintroRow absolute w-full h-full top-0 left-0">
        <div className="container relative h-full flex items-center">
          {/* Main Content */}
          <div className="relative z-10 introcont">
            <h2 className="ffamilyTNR">About UStudy Global</h2>
            <p>
              At UStudy Global, we are committed to transforming <br />
              education through innovation and accessibility. Our <br />
              platform bridges academic learning with real-world skills, <br />
              empowering students and professionals worldwide.
            </p>
            <button className="text-blue-700 font-medium border-1 border-blue-700">
              READ MORE
            </button>
          </div>
        </div>
      </div>

      <div className="absolute usgtie pointer-events-none">
        <h2 className="ffamilyTNR">
          <span>U</span>StudyGlobal
        </h2>
      </div>
    </section>
  )
}

export default AboutUstudy
