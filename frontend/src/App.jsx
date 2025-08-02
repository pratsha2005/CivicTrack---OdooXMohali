import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { Login } from './pages/Login'
import { Home } from './pages/Home'
// import { User } from './user/User';
// import { Admin } from './admin/Admin';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<User />} />
        <Route path="/admin-dashboard" element={<Admin />} /> */}
      </Routes>
    </div>
  );
}

export default App;