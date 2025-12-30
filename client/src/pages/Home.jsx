import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getEquipment, reset } from '../redux/equipmentSlice';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar'; 

const Home = () => {
  const dispatch = useDispatch();
  const { items, isLoading, isError, message } = useSelector((state) => state.equipment);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    dispatch(getEquipment());
    return () => dispatch(reset());
  }, [isError, message, dispatch]);

  if (isLoading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
    <SearchBar />

      <h1 className="text-3xl font-bold mb-6">Available Equipment</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item._id} className="border rounded-lg shadow-md overflow-hidden bg-white">
            {/* CHANGED h-48 TO h-64 HERE */}
            <img src={item.image} alt={item.name} className="w-full h-64 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-gray-600 text-sm mt-1">{item.category}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-indigo-600 font-bold">₹{item.dailyPrice.toLocaleString('en-IN')}/day</span>
                <Link 
                  to={`/product/${item._id}`} 
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;