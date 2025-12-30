import { useState, useEffect, useContext } from 'react'; // Added useContext
import { useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axiosConfig'; // Direct API call
import toast, { Toaster } from 'react-hot-toast';
import AuthContext from '../context/AuthContext'; // Import AuthContext

const Register = () => {
  const [formData, setFormData] = useState({ 
      name: '', email: '', password: '', role: 'user' 
  });
  const { name, email, password, role } = formData;
  const [isLoading, setIsLoading] = useState(false); // Local loading state

  const navigate = useNavigate();
  
  // 1. Get login function and user status from Context
  const { login, user } = useContext(AuthContext);

  // 2. Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/'); 
    }
  }, [user, navigate]);

  const onChange = (e) => {
    if (e.target.name === 'isVendor') {
        setFormData((prevState) => ({
            ...prevState,
            role: e.target.checked ? 'vendor' : 'user'
        }));
    } else {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 3. Call API directly (Replaces dispatch(register))
      const { data } = await axios.post('/auth/register', formData);
      
      // 4. Update Context & SessionStorage
      login(data);

      toast.success('Registration Successful!');
      setTimeout(() => navigate('/'), 1000);

    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Toaster />
      <div className="w-96 p-6 shadow-lg bg-white rounded-md">
        <h1 className="text-3xl block text-center font-semibold">Sign Up</h1>
        <hr className="mt-3" />
        <form onSubmit={onSubmit} className="mt-6">
          <div className="mt-3">
            <label className="block text-base mb-2">Name</label>
            <input type="text" name="name" value={name} onChange={onChange} className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600" placeholder="John Doe" />
          </div>
          <div className="mt-3">
            <label className="block text-base mb-2">Email</label>
            <input type="email" name="email" value={email} onChange={onChange} className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600" placeholder="john@example.com" />
          </div>
          <div className="mt-3">
            <label className="block text-base mb-2">Password</label>
            <input type="password" name="password" value={password} onChange={onChange} className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600" placeholder="••••••" />
          </div>

          {/* Vendor Checkbox */}
          <div className="mt-4 flex items-center gap-2">
            <input 
                type="checkbox" 
                name="isVendor"
                id="isVendor"
                checked={role === 'vendor'}
                onChange={onChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="isVendor" className="text-gray-700 font-medium select-none cursor-pointer">
                Register as a Vendor (I want to rent out gear)
            </label>
          </div>

          <div className="mt-5">
            <button type="submit" className="border-2 border-indigo-700 bg-indigo-700 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-indigo-700 font-semibold">
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
          <div className="mt-3 text-center">
             <span className="text-sm text-gray-500">Already have an account? </span>
             <Link to="/login" className="text-indigo-600 font-bold hover:underline">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;