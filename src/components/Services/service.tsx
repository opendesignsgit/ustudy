import React, { useState } from 'react'
import ServiceModal from './ServiceModal'

type User = {
  id: number
  title: string
  para: string
  imgs: string
}

const service = () => {
  const users: User[] = [
    {
      id: 1,
      imgs: '/media/services/service-img1.jpg',
      title: 'Application Guidance',
      para: 'Ustudy offers expert application guidance, ensuring your documents are accurate and...',
    },
    {
      id: 2,
      imgs: '/media/services/service-img2.jpg',
      title: 'Visa, Forex',
      para: 'Ustudy assists in obtaining the right student visa and ensures smooth foreign exchange...',
    },
    {
      id: 3,
      imgs: '/media/services/service-img3.jpg',
      title: 'Ticketing',
      para: 'We help ensure your travel aligns with your academic schedule and is as cost-effectiv...',
    },
    {
      id: 4,
      imgs: '/media/services/service-img4.jpg',
      title: 'Pre-departure Counseling',
      para: 'Pre-departure counseling prepares you for life abroad, covering academic, cultural, a...',
    },
    {
      id: 5,
      imgs: '/media/services/service-img5.jpg',
      title: 'Dos and Don’ts',
      para: 'Ustudy’s Dos and Don’ts guide ensures you are well-prepared for cultural and academi...',
    },
    {
      id: 6,
      imgs: '/media/services/service-img6.jpg',
      title: 'Accommodation',
      para: 'We help you choose a location that’s safe, convenient, and within your budget...',
    },
    {
      id: 7,
      imgs: '/media/services/service-img7.jpg',
      title: 'Post Landing Formalities',
      para: 'We ensure you complete all required formalities smoothly after you arrive in you...',
    },
    {
      id: 8,
      imgs: '/media/services/service-img8.jpg',
      title: 'Financial Guidance, Scholarships',
      para: 'Ustudy provides expert financial guidance to help manage your budget and find scholar...',
    },
    {
      id: 9,
      imgs: '/media/services/service-img9.jpg',
      title: 'Guided Hands-on Projects',
      para: 'Ustudy offers guided hands-on projects that provide practical experience alongside your...',
    },
  ]
  return (
    <>
      <section className="inerpageban servbansec relative">
        <div className="inpbanimg relative">
          <img src="/media/services/service-ban-img.jpg" alt="Services" />
        </div>
        <div className="inpbancont absolute top-0 left-0 w-full h-full z-10">
          <div className="container relative h-full flex flex-col items-center justify-center text-center">
            <h1 className="ffamilyTNR">Comprehensive Support for Your Educational Journey </h1>
            <p className="fonteighteen">
              We provide tailored services to guide you from course selection to successful
              admission. With <br />
              expert support at every step, we make your path to education seamless and efficient.
            </p>
          </div>
        </div>
      </section>
      <section className="servisec secpadblock">
        <div className="container-fuild">
          <div className="SerBoxsList flex flex-wrap">
            {users.map((user) => (
              <div className="SerLists" key={user.id}>
                <div className="SListImg">
                  <img src={user.imgs} alt={user.title} />
                </div>
                <div className="SListCont">
                  <h3>{user.title}</h3>
                  <p>{user.para}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default service
