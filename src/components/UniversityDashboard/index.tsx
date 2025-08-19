import React from 'react'
import { Banner } from '@payloadcms/ui/elements/Banner'
import './index.scss'

const baseClass = 'university-dashboard'

const UniversityDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to your University Admin Panel!</h4>
      </Banner>
      <div className={`${baseClass}__content`}>
        <p>
          This is your dedicated university administration panel. Here you can:
        </p>
        <ul className={`${baseClass}__instructions`}>
          <li>
            <strong>Manage your university information</strong> - Update your university details, 
            contact information, and content
          </li>
          <li>
            <strong>Create and manage pages</strong> - Add new pages that will appear as sub-menus 
            on your university website (e.g., About Us, Programs, etc.)
          </li>
          <li>
            <strong>Edit content</strong> - Use the rich text editor to create engaging content 
            for your university pages
          </li>
          <li>
            <strong>Preview your changes</strong> - Visit your public university page to see 
            how your content appears to visitors
          </li>
        </ul>
        
        <div className={`${baseClass}__quick-links`}>
          <h5>Quick Actions:</h5>
          <div className={`${baseClass}__links`}>
            <a 
              href="/admin/collections/university-pages" 
              className={`${baseClass}__link`}
            >
              Manage University Pages
            </a>
          </div>
        </div>
        
        <div className={`${baseClass}__note`}>
          <p>
            <strong>Note:</strong> Pages you create with "Show in menu" enabled will automatically 
            appear as navigation items on your university's public page. Use the menu order field 
            to control the sequence of menu items.
          </p>
        </div>
      </div>
    </div>
  )
}

export default UniversityDashboard