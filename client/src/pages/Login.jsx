import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axiosConfig'; // Direct API call
import toast, { Toaster } from 'react-hot-toast';
import AuthContext from '../context/AuthContext'; // We use this instead of Redux

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;

  const navigate = useNavigate();
  
  // 1. Get the login function from AuthContext
  // This function automatically saves to sessionStorage
  const { login } = useContext(AuthContext);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/auth/login', formData);
      
      login(response.data); 

      toast.success('Login Successful!');
      setTimeout(() => navigate('/'), 1000);

    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Toaster />
      <div className="w-96 p-6 shadow-lg bg-white rounded-md">
        <h1 className="text-3xl block text-center font-semibold">Login</h1>
        <hr className="mt-3" />
        <form onSubmit={onSubmit} className="mt-6">
          <div className="mt-3">
            <label className="block text-base mb-2">Email</label>
            <input 
              type="email" 
              name="email" 
              value={email} 
              onChange={onChange} 
              required
              className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600" 
            />
          </div>
          <div className="mt-3">
            <label className="block text-base mb-2">Password</label>
            <input 
              type="password" 
              name="password" 
              value={password} 
              onChange={onChange} 
              required
              className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600" 
            />
          </div>
          <div className="mt-5">
            <button type="submit" className="border-2 border-indigo-700 bg-indigo-700 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-indigo-700 font-semibold">
              Login
            </button>
          </div>
        </form>
        <p className='mt-3 text-center'>
          Don't have an account? <Link to="/register" className='text-indigo-600'>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;