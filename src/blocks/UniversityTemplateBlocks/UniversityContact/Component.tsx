import React, { useState } from 'react'

type Props = {
  block: any // UniversityContactBlock when types are generated
}

export const UniversityContact: React.FC<Props> = ({ block }) => {
  const { title, layout, contactInfo, showContactForm, formFields, socialLinks } = block
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')
    
    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitMessage('Thank you for your message! We will get back to you soon.')
      setFormData({})
    } catch (error) {
      setSubmitMessage('Sorry, there was an error sending your message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return '📘'
      case 'twitter':
        return '🐦'
      case 'linkedin':
        return '💼'
      case 'instagram':
        return '📷'
      case 'youtube':
        return '📺'
      default:
        return '🔗'
    }
  }

  const getLayoutClasses = () => {
    switch (layout) {
      case 'side-by-side':
        return 'grid md:grid-cols-2 gap-8'
      case 'info-only':
        return 'max-w-2xl mx-auto'
      case 'form-only':
        return 'max-w-2xl mx-auto'
      case 'stacked':
        return 'space-y-8'
      default:
        return 'grid md:grid-cols-2 gap-8'
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
        </div>
        
        <div className={getLayoutClasses()}>
          {/* Contact Information */}
          {layout !== 'form-only' && contactInfo && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Get in Touch
              </h3>
              
              <div className="space-y-4">
                {contactInfo.address && (
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600 text-xl">📍</span>
                    <div>
                      <h4 className="font-medium text-gray-900">Address</h4>
                      <p className="text-gray-600 whitespace-pre-line">{contactInfo.address}</p>
                    </div>
                  </div>
                )}
                
                {contactInfo.phone && (
                  <div className="flex items-center gap-3">
                    <span className="text-blue-600 text-xl">📞</span>
                    <div>
                      <h4 className="font-medium text-gray-900">Phone</h4>
                      <a href={`tel:${contactInfo.phone}`} className="text-blue-600 hover:text-blue-800">
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {contactInfo.email && (
                  <div className="flex items-center gap-3">
                    <span className="text-blue-600 text-xl">✉️</span>
                    <div>
                      <h4 className="font-medium text-gray-900">Email</h4>
                      <a href={`mailto:${contactInfo.email}`} className="text-blue-600 hover:text-blue-800">
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {contactInfo.website && (
                  <div className="flex items-center gap-3">
                    <span className="text-blue-600 text-xl">🌐</span>
                    <div>
                      <h4 className="font-medium text-gray-900">Website</h4>
                      <a 
                        href={contactInfo.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {contactInfo.website}
                      </a>
                    </div>
                  </div>
                )}
                
                {/* Admissions Contact */}
                {(contactInfo.admissionsEmail || contactInfo.admissionsPhone) && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Admissions Office</h4>
                    <div className="space-y-2">
                      {contactInfo.admissionsEmail && (
                        <div className="flex items-center gap-3">
                          <span className="text-green-600 text-xl">✉️</span>
                          <a href={`mailto:${contactInfo.admissionsEmail}`} className="text-green-600 hover:text-green-800">
                            {contactInfo.admissionsEmail}
                          </a>
                        </div>
                      )}
                      {contactInfo.admissionsPhone && (
                        <div className="flex items-center gap-3">
                          <span className="text-green-600 text-xl">📞</span>
                          <a href={`tel:${contactInfo.admissionsPhone}`} className="text-green-600 hover:text-green-800">
                            {contactInfo.admissionsPhone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Social Links */}
              {socialLinks && socialLinks.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-medium text-gray-900 mb-4">Follow Us</h4>
                  <div className="flex gap-4">
                    {socialLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-2xl hover:scale-110 transition-transform"
                        title={link.customLabel || link.platform}
                      >
                        {getSocialIcon(link.platform)}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Contact Form */}
          {layout !== 'info-only' && showContactForm && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Send us a Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Default fields if no custom fields */}
                {(!formFields || formFields.length === 0) && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message || ''}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </>
                )}
                
                {/* Custom fields */}
                {formFields && formFields.map((field, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label} {field.required && '*'}
                    </label>
                    
                    {field.fieldType === 'textarea' ? (
                      <textarea
                        required={field.required}
                        placeholder={field.placeholder}
                        value={formData[field.label] || ''}
                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                      />
                    ) : field.fieldType === 'select' ? (
                      <select
                        required={field.required}
                        value={formData[field.label] || ''}
                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select...</option>
                        {field.options?.map((option, optIndex) => (
                          <option key={optIndex} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.fieldType}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={formData[field.label] || ''}
                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  </div>
                ))}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                
                {submitMessage && (
                  <div className={`p-4 rounded-lg ${
                    submitMessage.includes('Thank you') 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {submitMessage}
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}