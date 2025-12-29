import { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig'; 
import toast, { Toaster } from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get('/bookings/mybookings');
        setBookings(data);
      } catch (error) {
        toast.error('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking request?')) {
      try {
        await axios.put(`/bookings/${bookingId}/cancel`);
        toast.success('Booking Cancelled');

        setBookings(bookings.map(b =>
          b._id === bookingId ? { ...b, status: 'cancelled' } : b
        ));
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to cancel');
      }
    }
  };

  if (loading) return <div className="text-center mt-10">Loading your bookings...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">My Rentals</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">You haven't booked anything yet.</p>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <li key={booking._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  {/* Image */}
                  <img
                    src={booking.equipment?.image || 'https://via.placeholder.com/150'}
                    alt="Gear"
                    className="h-16 w-16 object-cover rounded"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium text-indigo-600 truncate">
                      {booking.equipment?.name || 'Unknown Item'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.startDate).toLocaleDateString()} — {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                      {booking.status.toUpperCase()}
                    </span>

                    <p className="text-sm font-bold text-gray-900">
                      ₹{booking.totalAmount.toLocaleString('en-IN')}
                    </p>

                    {/*Cancel Button only if Pending*/}
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="text-xs text-red-600 hover:text-red-900 border border-red-200 px-2 py-1 rounded hover:bg-red-50 transition"
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyBookings;