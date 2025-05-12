import Link from 'next/link'
import React from 'react'

const Contactus = () => {
  return (
    <>
      <section className="inerpageban servbansec relative">
        <div className="inpbanimg relative">
          <img src="/media/innerbanimg.jpg" alt="Services" />
        </div>
        <div className="inpbancont absolute top-0 left-0 w-full h-full z-10">
          <div className="container relative h-full flex flex-col items-center justify-center text-center">
            <h1 className="ffamilyTNR">Contact us</h1>
            <p className="fonteighteen">
              We’d love to hear from you! Whether you have a question, feedback, <br />
              or just want to say hello, feel free to reach out.
            </p>
          </div>
        </div>
      </section>
      <section className="contlistSec servbansec relative">
        <div className="container relative">
          <div className="contliBoxs flex bg-[#0056D2]">
            <div className="contliItems">
              <div className="contliIimg relative flex items-center justify-center">
                <img src="/media/mail-icon.svg" alt="Mail" />
              </div>
              <div className="contliICont relative">
                <h3>Send us a Mail</h3>
                <p>
                  <Link href="mailto:info@ustudyglobal.in">info@ustudyglobal.in</Link>
                </p>
              </div>
            </div>
            <div className="contliItems">
              <div className="contliIimg relative flex items-center justify-center">
                <img src="/media/phone-icon.svg" alt="Phone" />
              </div>
              <div className="contliICont relative">
                <h3>Call Us</h3>
                <p>
                  <Link href="tel:+918939393962">+91 89 39 39 39 62</Link> |{' '}
                  <Link href="tel:+918939393918">+91 89 39 39 39 18</Link>
                </p>
              </div>
            </div>
            <div className="contliItems">
              <div className="contliIimg relative flex items-center justify-center">
                <img src="/media/location-icon.svg" alt="location" />
              </div>
              <div className="contliICont relative">
                <h3>Address</h3>
                <address>
                  1st floor, Chettinad Chambers, 39, Dr Radha Krishnan Salai, 5th Street, Mylapore,
                  Chennai- 600 004.
                </address>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="contformSec">
        <div className="contformtitlerow">
          <div className="container">
            <div className="sectitle marbtm textcenter">
              <h2>Let’s talk !</h2>
              <p>Get in touch with us using the enquiry form or contact details below.</p>
            </div>
          </div>
        </div>
        <div className="contforminrow flex max-sm:flex-col">
          <div className="contformCol ColL flex items-center">
            <form className="formboxs flex flex-wrap">
              <div className="form-col">
                <input type="text" placeholder="Enter Your Full Name" />
              </div>
              <div className="form-col">
                <input type="text" placeholder="+91 Enter Your Mobile Number" />
              </div>
              <div className="form-col">
                <input type="email" placeholder="Enter Your Email" />
              </div>
              <div className="form-col">
                <input type="text" placeholder="Enter Your Location" />
              </div>
              <div className="form-col fullcol">
                <textarea placeholder="Enter Your Message"></textarea>
              </div>
              <div className="form-col fullcol">
                <button type="submit">GET IN TOUCH</button>
              </div>
            </form>
          </div>
          <div className="contformCol ColR">
            <img src="/media/contfromimg.jpg" alt="" />
          </div>
        </div>
      </section>
      <section className="ifrmeSec">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m12!1m8!1m3!1d3886.8800470979086!2d80.2644396!3d13.0433065!3m2!1i1024!2i768!4f13.1!2m1!1sueducate!5e0!3m2!1sen!2sin!4v1746789649560!5m2!1sen!2sin"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </>
  )
}

export default Contactus
