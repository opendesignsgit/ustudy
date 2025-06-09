"use client";
import Link from 'next/link'
import React, { useState } from 'react'

const initialState = { name: '', email: '', phone: '', location: '', message: '' }

// Only numbers starting with 6, 7, 8, or 9 and exactly 10 digits
const indianMobileRegex = /^[6-9][0-9]{9}$/;

const Contactus = () => {
  const [fields, setFields] = useState(initialState)
  const [errors, setErrors] = useState<{ [k: string]: string }>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [serverMsg, setServerMsg] = useState<string>('')

  const validate = () => {
    let newErrors: { [k: string]: string } = {};
    if (!fields.name.trim()) newErrors.name = "Full Name is required";
    if (!fields.phone.trim()) {
      newErrors.phone = "Mobile number is required";
    } else if (!indianMobileRegex.test(fields.phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9";
    }
    if (!fields.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(fields.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target;
    if (name === "phone") {
      value = value.replace(/[^0-9]/g, '').substring(0, 10);
    }
    setFields({ ...fields, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setServerMsg('')

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus('error');
      setServerMsg("Please fix the errors above.");
      return;
    }

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields)
    })
    const data = await res.json()
    if (!res.ok) {
      setStatus('error')
      setServerMsg(data.message || 'Submission failed')
      setErrors(data.errors || {})
      return
    }
    setStatus('success')
    setServerMsg('Thank you! Your message has been sent.')
    setFields(initialState)
    setErrors({})
  }

  return (
    <>
      <section className="inerpageban servbansec relative">
        <div className="inpbanimg relative">
          <img src="/media/services/contactus-ban-img.jpg" alt="Services" />
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
                  <Link href="tel:+918939393962">+91 89 39 39 39 62</Link>
                  <span>|</span>
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
                  2nd Floor, Chettinad Chambers, 39, <br />Dr. Radha Krishnan Salai, 5th Street, <br />Mylapore, Chennai- 600 004.
                </address>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="contformSec" id="contformSec">
        <div className="contformtitlerow">
          <div className="container">
            <div className="sectitle marbtm textcenter">
              <h2>Let’s talk!</h2>
              <p>Get in touch with us using the enquiry form or contact details below.</p>
            </div>
          </div>
        </div>
        <div className="contforminrow flex max-sm:flex-col">
          <div className="contformCol ColL flex items-center">
            <form className="formboxs flex flex-wrap" onSubmit={handleSubmit} noValidate>
              <div className="form-col">
                <input
                  type="text"
                  placeholder="Enter Your Full Name"
                  name="name"
                  value={fields.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>
              <div className="form-col">
                <input
                  type="text"
                  placeholder="+91 Enter Your Mobile Number"
                  name="phone"
                  value={fields.phone}
                  onChange={handleChange}
                  maxLength={10}
                />
                {errors.phone && <div className="form-error">{errors.phone}</div>}
              </div>
              <div className="form-col">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  name="email"
                  value={fields.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>
              <div className="form-col">
                <input
                  type="text"
                  placeholder="Enter Your Location"
                  name="location"
                  value={fields.location}
                  onChange={handleChange}
                />
              </div>
              <div className="form-col fullcol">
                <textarea
                  placeholder="Enter Your Message"
                  name="message"
                  value={fields.message}
                  onChange={handleChange}
                />
              </div>
              <div className="form-col fullcol">
                <button type="submit" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Sending...' : 'GET IN TOUCH'}
                </button>
                {status === 'success' && <div className="form-success">{serverMsg}</div>}
                {status === 'error' && <div className="form-error">{serverMsg}</div>}
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