'use client'

import React from 'react'
import { useAuth } from '@payloadcms/ui'

const ConditionalNavigation: React.FC = () => {

  const { user } = useAuth()

  // For university-role users or universities collection users, hide non-university collections
  if (
    (user?.collection === 'users' && user?.role === 'university-role') ||
    user?.collection === 'universities'
  ) {
    // Hide non-university groups by adding CSS to hide them
    React.useEffect(() => {
      const style = document.createElement('style')
      style.textContent = `
        /* Hide all nav groups except Universities */
        .payload-admin__nav .nav__group:not([data-group="Universities"]) {
          display: none !important;
        }
        
        /* Hide individual collections that are not in Universities group */
        .payload-admin__nav .nav__group-list .nav__link[href*="/collections/pages"],
        .payload-admin__nav .nav__group-list .nav__link[href*="/collections/posts"],
        .payload-admin__nav .nav__group-list .nav__link[href*="/collections/media"],
        .payload-admin__nav .nav__group-list .nav__link[href*="/collections/categories"] {
          display: none !important;
        }
        
        /* Also hide globals and other non-university sections */
        .payload-admin__nav .nav__label:contains("Globals") + .nav__group,
        .payload-admin__nav .nav__group[data-group="Globals"] {
          display: none !important;
        }
      `
      document.head.appendChild(style)

      return () => {
        document.head.removeChild(style)
      }
    }, [])
  }

  return null
}


export default ConditionalNavigation