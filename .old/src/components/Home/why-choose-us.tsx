'use client'
import React, { useState, useEffect, useRef } from 'react'
import CountUp from 'react-countup'

const StatCard = ({ number, label, description, shouldAnimate }) => {
  return (
    <div className="wchItemss">
      <h3>
        {shouldAnimate ? <CountUp start={0} end={number} duration={2.5} /> : `${number}`}{' '}
        <small>+</small>
      </h3>
      <h4>{label}</h4>
      <p>{description}</p>
    </div>
  )
}

const WhyChooseUs = () => {
  const [animate, setAnimate] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimate(false)
          } else {
            setAnimate(false)
          }
        })
      },
      { threshold: 0.5 }, // Trigger when 50% of the section is visible
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const stats = [
    {
      number: 175,
      label: 'Courses',
      description:
        'Explore a wide range of industry-ready courses from beginner to expert level. Each program is designed to build your knowledge and real-world skills.',
    },
    {
      number: 17,
      label: 'Institution Partners',
      description:
        'Partnered with leading institutions like BAC, Veritas, and more. Gain access to recognized certifications and career opportunities.',
    },
    {
      number: 95,
      label: 'Flexible Learning',
      description:
        'Choose flexible online or offline learning that fits your schedule. Study anytime, anywhere—your learning, your pace.',
    },
    {
      number: 140,
      label: 'Expert Instructors',
      description:
        'Learn directly from industry professionals with hands-on experience. Get personalized support to help you succeed in your career.',
    },
  ]
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      const newDiv = document.createElement('div')
      newDiv.innerHTML = `
        <div class="wcusdotslst">
          <div class="wcusdots lione"></div>
          <div class="wcusdots litwo"></div>
          <div class="wcusdots lithree"></div>
          <div class="wcusdots lifour"></div>
        </div>
      `
      containerRef.current.appendChild(newDiv)
    }
  }, [])
  return (
    <section className="hwcusSec relative secpadblock bg-white" ref={sectionRef}>
      <div className="container">
        <div className="sectitle marbtm textcenter">
          <h2>Why Choose Us</h2>
        </div>
        <div className="flex flex-wrap relative wchItmBox" id="wchItmBox" ref={containerRef}>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              number={stat.number}
              label={stat.label}
              description={stat.description}
              shouldAnimate={animate} // Pass the animate state
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
