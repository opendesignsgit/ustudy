"use client";
import React, { useState } from 'react'

const initialState = { name: '', email: '', phone: '', location: '', message: '' }
const indianMobileRegex = /^[6-9][0-9]{9}$/;

const FooterForm = () => {
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
    <div className="bg-white text-white footformSec relative">
      <div className="container mx-auto">
        <div className="bg-[#F0F6FF] rounded-[2vw] overflow-hidden flex footformboxs">
          <div className="text-white bg-[#0056D2] TfootContCol">
            <h2 className="ffamilyTNR">
              Have a Query? <br />
              Get in touch with us Today
            </h2>
            <p>
              Get clear answers and expert guidance for all your questions. Our dedicated team is
              here to assist you with personalized support. Reach out to us anytime and take the
              next step with confidence!
            </p>
          </div>
          <div className="rounded-xl p-6 TfootFormCol">
            <form className="formboxs flex flex-wrap" onSubmit={handleSubmit} noValidate>
              <div className="form-col">
                <input
                  type="text"
                  placeholder="Enter Your Full Name *"
                  name="name"
                  value={fields.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>
              <div className="form-col">
                <input
                  type="text"
                  placeholder="+91 Enter Your Mobile Number *"
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
                  placeholder="Enter Your Email *"
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
        </div>
      </div>
    </div>
  )
}

export default FooterForm