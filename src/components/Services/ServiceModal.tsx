'use client'

import React, { useEffect, useRef, useState } from 'react'
type User = {
  title: string
  para: string
  paralong: string
  imgs: string
}

type ServiceModalProps = {
  user: User | null
  onClose: () => void
}

const ServiceModal: React.FC<ServiceModalProps> = ({ user, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose()
    }
  }

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    if (!user) return
    setTimeout(() => setShow(true), 10)
    // Disable body scroll
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollbarWidth}px`

    // Re-enable on cleanup
    return () => {
      document.body.style.overflow = 'auto'
      document.body.style.paddingRight = ''
    }
  }, [user])

  // Optional: Close on outside click
  useEffect(() => {
    if (!user) return

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [user, onClose])

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      onClose() // delay to allow transition to finish
    }, 300)
  }

  if (!user) return null

  return (
    <div
      ref={modalRef}
      onClick={closeModal}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`popContainer relative transform transition-all duration-300 ${
          show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }  shadow-lg`}
      >
        <div className="PopContainBox relative ">
          <button className="popclose" onClick={handleClose}>
            X
          </button>
          {/*<img src={user.imgs} alt={user.title} className="w-full h-40 object-cover rounded mb-4" />*/}
          <h2>{user.title}</h2>
          <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: user.paralong }} />
        </div>
      </div>
    </div>
  )
}

export default ServiceModal
