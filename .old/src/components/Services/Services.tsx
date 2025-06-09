'use client'
import React, { useState } from 'react'
import ServiceModal from './ServiceModal'

type User = {
  id: number
  title: string
  para: string
  paralong: string
  imgs: string
}
const Services = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const users: User[] = [
    {
      id: 1,
      imgs: '/media/services/service-img0.jpg',
      title: 'Counseling and Guidance',
      para: 'Ustudy provides personalized counseling and guidance to help you choose the right academic and career path.',
      paralong:
        '<ul> <li>Ustudy’s counseling and guidance service goes beyond just choosing a course—it’s about understanding your aspirations, skills, and future career prospects.</li> <li>We take the time to explore your interests in-depth, offering a tailored approach that ensures you make informed decisions for a successful academic journey.</li> <li>Our experienced counselors help you navigate through various academic systems, providing clarity on admission processes, eligibility, and country-specific requirements.</li> <li>With Ustudy, you receive continuous support, preparing you for every step of the way to a successful international education experience.</li>  </ul>',
    },
    {
      id: 2,
      imgs: '/media/services/service-img1.jpg',
      title: 'Application Guidance',
      para: 'Ustudy offers expert application guidance, ensuring your documents are accurate and submissions timely.',
      paralong:
        '<ul> <li>Application guidance at Ustudy ensures that your entire submission process is error-free and professionally presented.</li> <li>Our team assists with everything, from selecting the right documents to writing compelling personal statements and securing letters of recommendation.</li> <li>We focus on making sure your application stands out, aligning your profile with the requirements of top colleges and universities.</li> <li>Ustudy also helps with ensuring that you meet deadlines, preparing you for entrance exams, and keeping track of important timelines for success.</li>  </ul>',
    },
    {
      id: 3,
      imgs: '/media/services/service-img2.jpg',
      title: 'Visa, Forex',
      para: 'Ustudy assists in obtaining the right student visa and ensures smooth foreign exchange transactions.',
      paralong:
        '<ul> <li>Visa processing and foreign exchange guidance are critical steps in your study abroad journey, and Ustudy is here to simplify both.</li> <li>We assist you in gathering all the required documents, applying for the correct visa, and understanding the legal requirements of your destination country.</li> <li>Additionally, we help you navigate foreign exchange processes, ensuring you have access to currency and financial resources before you depart.</li> <li>With Ustudy’s visa and forex services, you can focus on your studies while we handle the paperwork and financial preparation.</li>  </ul>',
    },
    {
      id: 4,
      imgs: '/media/services/service-img3.jpg',
      title: 'Ticketing',
      para: 'Ustudy offers guidance in booking flights for students traveling abroad for their education.',
      paralong:
        "<ul> <li>Ustudy provides support and advice on booking flights for students planning to study abroad.</li> <li>We assist in finding the best travel options that fit your schedule and financial plans.</li> <li> Whether it's helping you choose the most convenient dates or offering recommendations for airlines, our aim is to make your travel experience smoother.</li> <li>With Ustudy’s help, you can secure a flight that suits both your educational and budgetary needs.</li>  </ul>",
    },
    {
      id: 5,
      imgs: '/media/services/service-img4.jpg',
      title: 'Pre-departure Counseling',
      para: 'Pre-departure counseling prepares you for life abroad, covering academic, cultural, and logistical aspects.',
      paralong:
        '<ul> <li>Pre-departure counseling at Ustudy ensures you are well-equipped to adjust to life in a new country.</li> <li>We provide in-depth sessions on cultural integration, local customs, academic expectations, and emergency procedures, making your transition seamless.</li> <li>Our counseling also focuses on practical matters like currency exchange, local transportation, and adapting to new surroundings.</li> <li>With Ustudy’s pre-departure counseling, you are prepared to embrace both the academic and personal challenges of studying abroad with confidence.</li>  </ul>',
    },
    {
      id: 6,
      imgs: '/media/services/service-img5.jpg',
      title: 'Dos and Don’ts',
      para: 'Ustudy’s Dos and Don’ts guide ensures you are well-prepared for cultural and academic life abroad.',
      paralong:
        '<ul> <li>Ustudy’s Dos and Don’ts guide offers you valuable insights into adapting to a new environment.</li> <li>Our guide covers essential aspects like cultural norms, communication etiquette, and how to maintain a balanced lifestyle while studying abroad.</li> <li>We also highlight common mistakes to avoid, ensuring you don’t face unnecessary challenges in your new environment.</li> <li>By following our Dos and Don’ts, you’ll easily navigate through academic life, personal relationships, and cultural adjustments, ensuring a smooth transition.</li>  </ul>',
    },
    {
      id: 7,
      imgs: '/media/services/service-img6.jpg',
      title: 'Accommodation',
      para: 'Ustudy assists in finding the right accommodation, whether on-campus or off-campus, for a comfortable living experience.',
      paralong:
        '<ul> <li>Finding the perfect accommodation is a crucial part of your study abroad journey, and Ustudy offers comprehensive support in securing your living arrangements.</li> <li>We help you explore various options such as student dormitories, private rentals, and shared housing that fit your needs and budget.</li> <li>Our team ensures that your accommodation is safe, well-connected to campus, and offers the amenities necessary for a smooth academic life.</li> <li>With Ustudy’s accommodation guidance, you can focus on your studies while we take care of securing a comfortable place to live.</li>  </ul>',
    },
    {
      id: 8,
      imgs: '/media/services/service-img7.jpg',
      title: 'Post Landing Formalities',
      para: 'Ustudy provides support for post-landing formalities, including immigration and orientation.',
      paralong:
        '<ul> <li>Post-landing formalities are crucial in your transition to studying abroad, and Ustudy ensures you’re fully supported.</li> <li>We assist with immigration checks, registration at your educational institution, and understanding local laws and regulations.</li> <li>Additionally, we help you with setting up a bank account, getting a local SIM card, and any other necessary tasks for settling in.</li> <li>Ustudy makes sure you have everything covered, allowing you to adjust to your new environment without stress.</li>  </ul>',
    },
    {
      id: 9,
      imgs: '/media/services/service-img8.jpg',
      title: 'Financial Guidance, Scholarships',
      para: 'Ustudy provides expert financial guidance to help manage your budget and find scholarships.',
      paralong:
        '<ul> <li>Financial guidance and scholarship assistance are key to reducing the burden of studying abroad, and Ustudy is here to help.</li> <li>We work closely with you to create a comprehensive budget plan that covers tuition, living expenses, and other costs.</li> <li>Our team also provides information on scholarships, grants, and funding options specific to your course, country, and institution.</li> <li>With Ustudy’s financial guidance, you can focus on your academic success while minimizing financial stress.</li>  </ul>',
    },
    {
      id: 10,
      imgs: '/media/services/service-img9.jpg',
      title: 'Guided Hands-on Projects',
      para: 'Ustudy offers guided hands-on projects that provide practical experience alongside your academic studies.',
      paralong:
        '<ul> <li>Guided hands-on projects at Ustudy give you the opportunity to apply your learning in real-world situations.</li> <li>These projects span various fields and industries, providing practical experience that enhances your academic journey.</li> <li>Our experts work closely with you to ensure you develop skills that are directly applicable to your chosen career.</li> <li>Ustudy’s hands-on approach bridges the gap between theory and practice, making you more employable and prepared for future opportunities.</li>  </ul>',
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
              <div className="SerLists" key={user.id} onClick={() => setSelectedUser(user)}>
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
      <ServiceModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </>
  )
}

export default Services
