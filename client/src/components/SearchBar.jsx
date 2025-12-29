import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getEquipment } from '../redux/equipmentSlice';

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(getEquipment(keyword));
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-lg mx-auto">
      <input 
        type="text" 
        placeholder="Search cameras, drones..." 
        className="w-full px-4 py-2 border rounded-l-lg focus:outline-indigo-500"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button 
        type="submit" 
        className="bg-indigo-600 text-white px-6 py-2 rounded-r-lg hover:bg-indigo-700 transition"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;