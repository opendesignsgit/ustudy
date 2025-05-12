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
      imgs: '/media/services/service-img1.jpg',
      title: 'Application guidance',
      para: 'Ustudy offers expert application guidance, ensuring your documents are accurate and...',
      paralong:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
    {
      id: 2,
      imgs: '/media/services/service-img2.jpg',
      title: 'Visa, Forex',
      para: 'Ustudy assists in obtaining the right student visa and ensures smooth foreign exchange...',
      paralong:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
    {
      id: 3,
      imgs: '/media/services/service-img3.jpg',
      title: 'Ticketing',
      para: 'We help ensure your travel aligns with your academic schedule and is as cost-effectiv...',
      paralong:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
    {
      id: 4,
      imgs: '/media/services/service-img4.jpg',
      title: 'Pre-departure counseling',
      para: 'Pre-departure counseling prepares you for life abroad, covering academic, cultural, a...',
      paralong:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
    {
      id: 5,
      imgs: '/media/services/service-img5.jpg',
      title: 'Dos and don’ts',
      para: 'Ustudy’s Dos and Don’ts guide ensures you are well-prepared for cultural and academi...',
      paralong:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
    {
      id: 6,
      imgs: '/media/services/service-img6.jpg',
      title: 'Accommodation',
      para: 'We help you choose a location that’s safe, convenient, and within your budget...',
      paralong:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
    {
      id: 7,
      imgs: '/media/services/service-img7.jpg',
      title: 'Post landing formalities',
      para: 'We ensure you complete all required formalities smoothly after you arrive in you...',
      paralong:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
    {
      id: 8,
      imgs: '/media/services/service-img8.jpg',
      title: 'Financial guidance, scholarships',
      para: 'Ustudy provides expert financial guidance to help manage your budget and find scholar...',
      paralong:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
    {
      id: 9,
      imgs: '/media/services/service-img9.jpg',
      title: 'Guided hands-on projects',
      para: 'Ustudy offers guided hands-on projects that provide practical experience alongside your...',
      paralong:
        '<ul > <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</li>  <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</li>  <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</li>  <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</li>  </ul>',
    },
  ]

  return (
    <>
      <section className="inerpageban servbansec relative">
        <div className="inpbanimg relative">
          <img src="/media/innerbanimg.jpg" alt="Services" />
        </div>
        <div className="inpbancont absolute top-0 left-0 w-full h-full z-10">
          <div className="container relative h-full flex flex-col items-center justify-center text-center">
            <h1 className="ffamilyTNR">Comprehensive Support for Your Educational Journey</h1>
            <p className="fonteighteen">
              We provide tailored services to guide you from course selection <br />
              to successful admission.
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
