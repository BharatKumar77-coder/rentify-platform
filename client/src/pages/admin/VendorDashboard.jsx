import { useEffect, useState, useContext } from 'react'; 
import { Link, useNavigate } from 'react-router-dom'; 
import axios from '../../utils/axiosConfig';
import toast, { Toaster } from 'react-hot-toast';
import AuthContext from '../../context/AuthContext'; 
const VendorDashboard = () => {

  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  // Calculate Stats
  const calculateStats = () => {
    const approvedBookings = bookings.filter(b => b.status === 'approved');
    const totalRevenue = approvedBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    const activeRentals = approvedBookings.length;
    return { totalRevenue, activeRentals };
  };

  const { totalRevenue, activeRentals } = calculateStats();

  // Fetch Data Functions
  const fetchMyItems = async () => {
    try {
      const { data } = await axios.get('/equipment/myitems');
      setItems(data);
    } catch (error) {
      toast.error('Failed to load inventory');
    }
  };

  const fetchVendorBookings = async () => {
    try {
      const { data } = await axios.get('/bookings/vendor');
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings");
    }
  };

  useEffect(() => {
    if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
      if (!user) navigate('/'); 
    } else {

      const loadData = async () => {
        setIsLoading(true);
        await Promise.all([fetchMyItems(), fetchVendorBookings()]);
        setIsLoading(false);
      };
      loadData();
    }
  }, [user, navigate]);

  // Status Handler
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await axios.put(`/bookings/${bookingId}`, { status: newStatus });
      toast.success(`Booking ${newStatus}`);
      fetchVendorBookings(); 
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // Delete Handler
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/equipment/${id}`); 
        toast.success('Item Deleted');
        fetchMyItems();
      } catch (error) {
        toast.error('Could not delete item');
      }
    }
  };

  if (isLoading) return <div className="text-center mt-20 text-lg font-semibold">Loading Dashboard...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Vendor Dashboard</h1>
          <p className="text-gray-500">Manage your inventory and track rentals.</p>
        </div>
        <Link
          to="/admin/add-product"
          className="bg-indigo-600 text-white px-6 py-3 rounded shadow-lg hover:bg-indigo-700 transition flex items-center gap-2 font-bold"
        >
          + Add New Item
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-indigo-500">
          <h3 className="text-gray-500 text-sm font-bold uppercase">Total Items</h3>
          <p className="text-4xl font-bold text-gray-800 mt-2">{items.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-bold uppercase">Active Rentals</h3>
          <p className="text-4xl font-bold text-gray-800 mt-2">{activeRentals}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <h3 className="text-gray-500 text-sm font-bold uppercase">Total Revenue</h3>
          <p className="text-4xl font-bold text-gray-800 mt-2">₹{totalRevenue.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Inventory Table */}
      <h2 className="text-xl font-bold mb-4 text-gray-700">My Inventory</h2>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {items.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <p className="text-lg">You haven't posted any equipment yet.</p>
            <Link to="/admin/add-product" className="text-indigo-600 font-bold mt-2 block hover:underline">
              Add your first item
            </Link>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price / Day</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0">
                        <img className="h-12 w-12 rounded object-cover border" src={item.image} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[150px]">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    ₹{item.dailyPrice.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <h2 className="text-xl font-bold mb-4 mt-12 text-gray-700">Incoming Rental Requests</h2>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-10">
        {bookings.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <p>No booking requests yet.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Item</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {booking.equipment?.name || 'Item Deleted'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {booking.user?.name}
                    <br />
                    <span className="text-xs">{booking.user?.email}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {booking.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'approved')}
                          className="text-green-600 hover:text-green-900 font-bold border border-green-200 px-2 py-1 rounded hover:bg-green-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                          className="text-red-600 hover:text-red-900 font-bold border border-red-200 px-2 py-1 rounded hover:bg-red-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;