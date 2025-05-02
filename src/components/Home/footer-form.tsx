import React from "react";

const FooterForm = () => {
  return (
    <div className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-blue-800 rounded-xl p-6 text-center md:text-left md:flex md:items-center md:gap-8">
          <div className="text-white mb-6 md:mb-0">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Have a Query? <br />
              Get in touch with us Today
            </h2>
            <p className="text-lg">
              Get clear answers and expert guidance for all your questions. Our
              dedicated team is here to assist you with personalized support.
              Reach out to us anytime and take the next step with confidence!
            </p>
          </div>
          <div className="bg-blue-50 text-gray-800 rounded-xl p-6 shadow-lg flex-grow">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Enter Your Full Name"
                className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="+91 Enter Your Mobile Number"
                className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
              />
              <input
                type="email"
                placeholder="Enter Your Email"
                className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Enter Your Location"
                className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400"
              />
              <textarea
                placeholder="Enter Your Message"
                className="p-3 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-400 col-span-1 md:col-span-2"
              ></textarea>
              <button
                type="submit"
                className="p-3 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700 transition duration-300 col-span-1 md:col-span-2"
              >
                GET IN TOUCH
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterForm;