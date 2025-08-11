import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'University Dashboard',
  description: 'University dashboard and management',
}

export default function UniversityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}