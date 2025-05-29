import Link from 'next/link'
import React from 'react'
import {
  faYoutube,
  faXTwitter,
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
                  <a href="https://www.instagram.com/ustudy_global/" target='_blank' className="hover:text-gray-300 transition">
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                </li>
                <li>
                  <a href="https://x.com/ustudy_global" target='_blank' className="hover:text-gray-300 transition">
                    <FontAwesomeIcon icon={faXTwitter} />
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/ustudy-global-456651354/" target='_blank' className="hover:text-gray-300 transition">
                    <FontAwesomeIcon icon={faLinkedinIn} />
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/channel/UCOAPhVbote6lIYHk6OJiFcg" target='_blank' className="hover:text-gray-300 transition">
                    <FontAwesomeIcon icon={faYoutube} />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Section */}
          <div className="footmcol">
            <h3 className="footTitle">CONTACT</h3>
            <address>
              2nd Floor, Chettinad Chambers, 39, <br />
              Dr. Radha Krishnan Salai, 5th Street, <br />
              Mylapore, Chennai – 600 004.
            </address>
            <div className="mt-4 contlink">
              <p className="flex items-center gap-2 mailpara">
                <a href="mailto:info@ustudyglobal.in">info@ustudyglobal.in</a>
              </p>
              <p className="flex items-center gap-2 phonepara">
                <a href="tel:+918939393962">89 39 39 39 62</a> /
                <a href="tel:+918939393918">89 39 39 39 18</a>
              </p>
            </div>
          </div>

          {/* Useful Links Section */}
          <div className="footmcol">
            <h3 className="footTitle">USEFUL LINK</h3>
            <ul className="space-y-2 text-sm fonteighteen">
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
            <ul className="space-y-2 text-sm fonteighteen">
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
            Copyright © 2025. Ustudy / <a href="https://opendesignsin.com/" target='_blank'>Designed By <img src="/media/openlogo.png" alt="" /></a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
