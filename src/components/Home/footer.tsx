import Link from 'next/link'
import React from 'react'
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between footbtm">
          {/* Logo and Social Icons Section */}
          <div className="footmcol">
            <div className="footlogoimg">
              {' '}
              <img
                src="/media/footlogo.svg" // Replace with the actual logo path
                alt="UStudy Logo"
                className="footlogo"
              />
            </div>
            <div className="footSmedialist">
              <ul className="footSmediaul flex items-center ">
                <li>
                  <a href="#" className="hover:text-gray-300 transition">
                    <FontAwesomeIcon icon={faFacebookF} />
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300 transition">
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300 transition">
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300 transition">
                    <FontAwesomeIcon icon={faLinkedinIn} />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Section */}
          <div className="footmcol">
            <h3 className="footTitle">CONTACT</h3>
            <address>
              2/21, 2nd floor, B.W.East Ave Rd, <br />
              CIT Colony, Mylapore, Chennai, <br />
              Tamil Nadu 600004.
            </address>
            <div className="mt-4 contlink">
              <p className="flex items-center gap-2 mailpara">
                📧 <a href="mailto:info@ustudyglobal.in">info@ustudyglobal.in</a>
              </p>
              <p className="phonepara">📞 89 39 39 39 62 / 89 39 39 39 18</p>
            </div>
          </div>

          {/* Useful Links Section */}
          <div className="footmcol">
            <h3 className="footTitle">USEFUL LINK</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">About Us</Link>
              </li>
              <li>
                <Link href="/">Contact Us</Link>
              </li>
              <li>
                <Link href="/">Enquiry</Link>
              </li>
              <li>
                <Link href="/">University Login</Link>
              </li>
            </ul>
          </div>

          {/* Policy Links Section */}
          <div className="footmcol">
            <h3 className="footTitle">POLICY LINK</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">Terms & Condition</Link>
              </li>
              <li>
                <Link href="/">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/">Refund Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footcorightrow text-center py-[15px] flex justify-center">
          <p className="flex justify-center">
            Copyright © 2025. Ustudy / Designed By <img src="/media/openlogo.png" alt="" />
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
