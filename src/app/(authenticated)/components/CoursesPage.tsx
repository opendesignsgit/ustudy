// /(authenticated)/components/CoursesPage.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/Auth';
import { useRouter } from 'next/navigation';

export default function CoursesMenu() {
  const { user, refreshUser } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch bookings for this user by student ID
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        if (user && user.user && user.user.id) {
          const bookingsRes = await fetch(`/api/bookings?where[student][equals]=${user.user.id}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (!bookingsRes.ok) throw new Error(`Failed to fetch bookings`);
          const bookingsData = await bookingsRes.json();
          setBookings(bookingsData.docs || bookingsData.data || []);
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  if (loading) return <div className="text-center py-8 text-blue-600">Loading courses...</div>;
  if (error) return <div className="text-red-600 text-center py-8">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">My Bookings</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-blue-50">
            <tr>
              <th className="py-3 px-4 text-left text-blue-900">Course</th>
              <th className="py-3 px-4 text-left text-blue-900">Booking Date</th>
              <th className="py-3 px-4 text-left text-blue-900">Amount Paid</th>
              <th className="py-3 px-4 text-left text-blue-900">Booking Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking: any) => (
                <tr key={booking.id || booking._id} className="border-b hover:bg-blue-50">
                  <td className="py-3 px-4 text-gray-900">
                    {booking?.course?.title || booking?.course?.book || '-'}
                  </td>
                  <td className="py-3 px-4 text-gray-800">
                    {booking?.orderDate ? new Date(booking.orderDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-3 px-4 text-gray-800">
                    ₹{booking?.convertedAmount?.toFixed(2) || '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={
                      "px-2 py-1 rounded-full text-xs " +
                      (
                        booking?.bookingStatus === 'completed'
                          ? "bg-green-100 text-green-700"
                          : booking?.bookingStatus === 'pending'
                            ? "bg-yellow-100 text-yellow-700"
                            : booking?.bookingStatus === 'failed'
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                      )
                    }>
                      {booking?.bookingStatus ? booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1) : 'Confirmed'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}