import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext'; 

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const onLogout = () => {
    logout(); 
    navigate('/');
  };

  return (
    <nav className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center gap-2 tracking-wide">
          Rentify
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-indigo-200 transition">
            Browse Gear
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              {(user.role === 'vendor' || user.role === 'admin') && (
                <Link 
                  to="/admin/dashboard" 
                  className="hover:text-indigo-200 transition"
                >
                  Vendor Dashboard
                </Link>
              )}

              <Link to="/mybookings" className="hover:text-indigo-200 transition">
                My Rentals
              </Link>

              <div className="hidden md:block text-indigo-200 border-l border-indigo-500 pl-4">
                Hi, {user.name}
              </div>

              <button 
                onClick={onLogout} 
                className="bg-red-500 text-white px-4 py-1 rounded font-semibold hover:bg-red-600 transition text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="text-white hover:text-indigo-200 font-semibold transition"
              >
                Login
              </Link>
              
              <Link 
                to="/register" 
                className="bg-white text-indigo-700 px-4 py-1 rounded font-semibold hover:bg-gray-100 transition shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;