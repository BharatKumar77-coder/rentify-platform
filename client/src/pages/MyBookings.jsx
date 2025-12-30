import { useEffect, useState, useContext } from 'react';
import axios from '../utils/axiosConfig'; 
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; 
const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Use Context to get the user
  const { user } = useContext(AuthContext);

  // Fetch Bookings
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

    if (user) {
      fetchBookings();
    }
  }, [user]);

  // Handle Cancel Logic
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

  if (loading) return <div className="text-center mt-20">Loading your bookings...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Rentals</h1>

      {bookings.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-lg shadow border border-gray-100">
          <p className="text-xl text-gray-500">You haven't booked anything yet.</p>
          <Link to="/" className="inline-block mt-4 bg-indigo-600 text-white px-6 py-2 rounded font-bold hover:bg-indigo-700 transition">
            Browse Gear
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <li key={booking._id} className="p-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                <div className="flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0 md:space-x-6">
                  
                  {/* Image & Main Info */}
                  <div className="flex items-center space-x-4 w-full md:w-auto">
                    <img 
                      src={booking.equipment?.image || 'https://via.placeholder.com/150'} 
                      alt={booking.equipment?.name} 
                      className="h-20 w-20 object-cover rounded-lg shadow-sm border border-gray-200"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-indigo-700">
                        {booking.equipment?.name || 'Unknown Item'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(booking.startDate).toLocaleDateString()} — {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4">
                    
                    {/* Status Badge */}
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full tracking-wide uppercase shadow-sm
                      ${booking.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' : 
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 
                        'bg-red-100 text-red-800 border border-red-200'}`}>
                      {booking.status}
                    </span>

                    <p className="text-xl font-bold text-gray-800">
                      ₹{booking.totalAmount?.toLocaleString('en-IN')}
                    </p>

                    {/* Cancel Button (Only if Pending) */}
                    {booking.status === 'pending' && (
                       <button 
                         onClick={() => handleCancel(booking._id)}
                         className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-800 border border-red-200 px-3 py-2 rounded transition"
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