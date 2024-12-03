import NavBar from './components/molecules/NavBar';
import React from 'react';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Admin_Login from './components/pages/Admin_Login';
import AdminActivityLog from './components/pages/AdminActivityLog';
import EmailVerification from './components/pages/EmailVerification';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <NavBar />
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin-login" element={<Admin_Login />} />
                    <Route path="/admin-activity-log" element={<AdminActivityLog />} />
                    <Route path="/verify-email" element={<EmailVerification />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
