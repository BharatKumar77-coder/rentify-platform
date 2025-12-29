import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig'; 
import toast, { Toaster } from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch Item Details directly 
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await axios.get('/equipment'); 
        const found = data.find((p) => p._id === id);
        setItem(found);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load item');
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
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking Failed');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!item) return <div>Item not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow">
        {/* Left: Image & Info */}
        <div>
          <img src={item.image} alt={item.name} className="w-full rounded-lg mb-4" />
          <h1 className="text-3xl font-bold">{item.name}</h1>
          <p className="text-gray-600 mt-2">{item.description}</p>
          <p className="text-2xl text-indigo-600 font-bold mt-4">₹{item.dailyPrice.toLocaleString('en-IN')} / day</p>
        </div>

        {/* Right: Booking Form */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Book this Item</h3>
          <form onSubmit={handleBooking}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Start Date</label>
              <input 
                type="date" 
                required
                className="w-full p-2 border rounded"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">End Date</label>
              <input 
                type="date" 
                required
                className="w-full p-2 border rounded"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-indigo-600 text-white py-3 rounded font-bold hover:bg-indigo-700 transition"
            >
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;