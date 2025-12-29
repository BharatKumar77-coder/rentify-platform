import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Navbar from './components/Navbar'; 
import MyBookings from './pages/MyBookings';
import VendorDashboard from './pages/admin/VendorDashboard';
import AddProduct from './pages/admin/AddProduct';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/mybookings" element={<MyBookings />} />

          <Route path="/admin/dashboard" element={<VendorDashboard />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;