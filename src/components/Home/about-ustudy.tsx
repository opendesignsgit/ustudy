import React from "react";

const AboutUstudy = () => {
  return (
    <div className="relative bg-white py-20 px-10 flex items-center justify-between">
      {/* Large Background Text */}
      <div className="absolute inset-0 flex justify-center items-center">
        <h1 className="text-[15rem] font-bold text-blue-100 opacity-50 pointer-events-none">
          UStudyGlobal
        </h1>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-lg">
        <h1 className="text-4xl font-bold text-blue-700 mb-6">About Ustudy</h1>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          At UStudy Global, we are committed to transforming education through
          innovation and accessibility. Our platform bridges academic learning
          with real-world skills, empowering students and professionals
          worldwide.
        </p>
        <button className="px-6 py-3 text-blue-700 font-medium border-2 border-blue-700 rounded-md hover:bg-blue-700 hover:text-white transition">
          READ MORE
        </button>
      </div>

      {/* Image Section */}
      <div className="relative z-10 max-w-sm">
        <img
          src="path/to/image.jpg"
          alt="Educational Representation"
          className="rounded-lg"
        />
      </div>
    </div>
  );
};

export default AboutUstudy;