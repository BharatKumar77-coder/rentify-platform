import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig'; 
import toast, { Toaster } from 'react-hot-toast';
import AuthContext from '../context/AuthContext'; // Import Auth Context

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Get logged-in user data
  
  const [item, setItem] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch Item Details
  useEffect(() => {
    const fetchItem = async () => {
      try {
        // Ideally, create a specific route /equipment/:id to save bandwidth
        // But this works with your current setup
        const { data } = await axios.get('/equipment'); 
        const found = data.find((p) => p._id === id);
        setItem(found);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load item');
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/bookings', {
        equipmentId: id,
        startDate,
        endDate
      });
      toast.success('Booking Successful!');
      setTimeout(() => navigate('/my-bookings'), 2000); // Redirect to My Bookings
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking Failed');
    }
  };

  // CHECK OWNERSHIP
  // Handles cases where item.owner is just an ID string OR a populated object
  const isOwner = user && item && (
    (typeof item.owner === 'string' && item.owner === user._id) || 
    (item.owner?._id === user._id)
  );

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!item) return <div className="text-center mt-20">Item not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-lg">
        {/* Left: Image & Info */}
        <div>
          <img src={item.image} alt={item.name} className="w-full h-96 object-cover rounded-lg mb-6 shadow-sm" />
          <h1 className="text-3xl font-bold text-gray-800">{item.name}</h1>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-wide">{item.category}</p>
          <p className="text-gray-600 mt-4 leading-relaxed">{item.description}</p>
          <p className="text-3xl text-indigo-600 font-bold mt-6">
            ₹{item.dailyPrice.toLocaleString('en-IN')} <span className="text-base text-gray-500 font-normal">/ day</span>
          </p>
        </div>

        {/* Right: Booking Form */}
        <div className="bg-gray-50 p-8 rounded-xl h-fit border border-gray-100">
          <h3 className="text-xl font-bold mb-6 text-gray-800">Book this Item</h3>
          
          <form onSubmit={handleBooking}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-gray-700">Start Date</label>
              <input 
                type="date" 
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2 text-gray-700">End Date</label>
              <input 
                type="date" 
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* CONDITIONAL RENDERING: Button vs Warning */}
            {isOwner ? (
              <div className="w-full bg-red-100 border border-red-300 text-red-700 px-4 py-4 rounded text-center">
                <strong>You own this item.</strong>
                <p className="text-sm mt-1">Vendors cannot book their own inventory.</p>
              </div>
            ) : (
              <button 
                type="submit" 
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg transform hover:-translate-y-0.5"
              >
                Confirm Booking
              </button>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;