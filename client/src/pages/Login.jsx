import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, reset } from '../redux/authSlice';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) toast.error(message);
    if (user) navigate('/'); 
    dispatch(reset());
  }, [user, isError, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
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
              className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600" 
            />
          </div>
          <div className="mt-5">
            <button type="submit" className="border-2 border-indigo-700 bg-indigo-700 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-indigo-700 font-semibold">
              {isLoading ? 'Loading...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;