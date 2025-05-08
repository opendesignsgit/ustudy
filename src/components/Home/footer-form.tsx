import React from 'react'

const FooterForm = () => {
  return (
    <div className="bg-blue-900 text-white">
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
        </div>
      </div>
    </div>
  )
}

export default FooterForm
