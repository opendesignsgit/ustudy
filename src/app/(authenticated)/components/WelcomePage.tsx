import React, { useEffect, useState } from 'react'
import { useAuth } from '@/providers/Auth'

export default function MainPage() {
  const { user } = useAuth();
  const [bookingsCount, setBookingsCount] = useState(0);

  useEffect(() => {
    async function fetchBookingsCount() {
      if (user && user.user && user.user.id) {
        const res = await fetch(`/api/bookings?where[student][equals]=${user.user.id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setBookingsCount(data.totalDocs || data.total || data.docs?.length || 0);
        }
      }
    }
    fetchBookingsCount();
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-black">Welcome to Your Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Booked Courses</h3>
          <p className="text-3xl font-bold text-blue-600">
            {bookingsCount}
          </p>
        </div>
      </div>
      <p className="text-gray-500">
        This is your main page. Use the menu to navigate to your account details or courses.
      </p>
    </div>
  )
}