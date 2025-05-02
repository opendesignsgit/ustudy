import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Logo and Social Icons Section */}
          <div>
            <h3 className="font-bold text-lg mb-2">UStudy Global</h3>
            <img
              src="/path/to/logo.png" // Replace with the actual logo path
              alt="UStudy Logo"
              className="w-24 mb-4"
            />
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:text-gray-300 transition">
                <i className="fab fa-facebook"></i> {/* Replace with an actual icon */}
              </a>
              <a href="#" className="hover:text-gray-300 transition">
                <i className="fab fa-instagram"></i> {/* Replace with an actual icon */}
              </a>
              <a href="#" className="hover:text-gray-300 transition">
                <i className="fab fa-twitter"></i> {/* Replace with an actual icon */}
              </a>
              <a href="#" className="hover:text-gray-300 transition">
                <i className="fab fa-linkedin"></i> {/* Replace with an actual icon */}
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-bold text-lg mb-2">CONTACT</h3>
            <p className="text-sm">
              2/21, 2nd floor, B.W.East Ave Rd, <br />
              CIT Colony, Mylapore, Chennai, <br />
              Tamil Nadu 600004.
            </p>
            <div className="mt-4">
              <p className="flex items-center gap-2">
                📧 <a href="mailto:info@ustudyglobal.in">info@ustudyglobal.in</a>
              </p>
              <p>📞 89 39 39 39 62 / 89 39 39 39 18</p>
            </div>
          </div>

          {/* Useful Links Section */}
          <div>
            <h3 className="font-bold text-lg mb-2">USEFUL LINK</h3>
            <ul className="space-y-2 text-sm">
              <li>About Us</li>
              <li>Contact Us</li>
              <li>Enquiry</li>
              <li>University Login</li>
            </ul>
          </div>

          {/* Policy Links Section */}
          <div>
            <h3 className="font-bold text-lg mb-2">POLICY LINK</h3>
            <ul className="space-y-2 text-sm">
              <li>Terms & Condition</li>
              <li>Privacy Policy</li>
              <li>Refund Policy</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8 text-sm">
          Copyright © 2025. Ustudy / Designed By ❤️
        </div>
      </div>
    </footer>
  );
};

export default Footer;