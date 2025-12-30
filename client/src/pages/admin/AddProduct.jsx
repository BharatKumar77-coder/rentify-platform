import { useState, useContext, useEffect } from 'react'; 
import axios from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import AuthContext from '../../context/AuthContext'; 

const AddProduct = () => {
  const navigate = useNavigate();
  
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '', category: '', description: '', dailyPrice: ''
  });
  const [imageFile, setImageFile] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'vendor') {

      navigate('/');
    }
  }, [user, navigate]);

  const { name, category, description, dailyPrice } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]); 
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return toast.error('Please upload an image');
    
    setIsLoading(true);

    const data = new FormData();
    data.append('name', name);
    data.append('category', category);
    data.append('description', description);
    data.append('dailyPrice', dailyPrice);
    data.append('image', imageFile); 

    try {
      await axios.post('/equipment', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Equipment Added Successfully!');
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (error) {
      toast.error('Failed to add product');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null; 

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">Add New Equipment</h1>
      
      <form onSubmit={onSubmit} className="bg-white p-6 shadow rounded-lg space-y-4">
        <div>
          <label className="block font-bold mb-1">Item Name</label>
          <input type="text" name="name" value={name} onChange={onChange} required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-bold mb-1">Category</label>
           <select name="category" value={category} onChange={onChange} required className="w-full border p-2 rounded">
            <option value="">Select Category</option>
            <option value="Camera">Camera</option>
            <option value="Drone">Drone</option>
            <option value="Laptops">Laptops</option> {/* Fixed Typo: Drone -> Laptops */}
          </select>
        </div>
        <div>
          <label className="block font-bold mb-1">Price per Day (₹)</label>
          <input type="number" name="dailyPrice" value={dailyPrice} onChange={onChange} required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block font-bold mb-1">Product Image</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange} 
            required
            className="w-full border p-2 rounded bg-gray-50" 
          />
        </div>

        <div>
          <label className="block font-bold mb-1">Description</label>
          <textarea name="description" value={description} onChange={onChange} required className="w-full border p-2 rounded"></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full text-white py-2 rounded font-bold transition ${isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
        >
          {isLoading ? 'Uploading to Cloud...' : 'Publish Item'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;