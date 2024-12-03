import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin_Login.css';

const Admin_Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://softwaresecurity.vercel.app/api/login', { email, password });
            setMessage(response.data.message);
            if (response.data.message === 'Admin login successful') {
                alert('Admin login successful');
                // Save token to local storage
                localStorage.setItem('token', response.data.token);
                // Navigate to the admin activity log page
                navigate('/admin-activity-log');
            }
        } catch (error) {
            setMessage('Login failed. Please try again.');
            alert('Login failed. Please try again.');
            console.error(error);
        }
    };

    return (
        <div className="background-image10">
            <div className="login-container" id="login-container">
                <form className="form-signin text-center" id="form-signin" onSubmit={handleLogin}>
                    <div className="login-form" id="form-container">
                        <div id="form-child">
                            <h2 className="form-heading">Admin Login</h2>
                            <div className="mb-4">
                                <div className="form-group form-group-1">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="text"
                                        name="email"
                                        id="email"
                                        className="form-control"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group form-group-2">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        className="form-control"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button className="btn btn-outline-light btn-lg btn-block form-group-3" type="submit">
                                Log in
                            </button>
                            <br />
                            {message && <p>{message}</p>}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Admin_Login;
