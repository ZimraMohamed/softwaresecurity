import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://softwaresecurity.vercel.app/api/login', { email, password });
            if (response.status === 200 && response.data.message === 'Login successful') {
                alert('Login successful');

                // Save the token to local storage for later use
                localStorage.setItem('token', response.data.token);

                navigate("/"); // Redirect to the main page after successful login
            } else {
                setLoginError(response.data.message);
            }
        } catch (error) {
            console.error("Error logging in:", error);
            setLoginError(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="background-image10">
            <div className="login-container" id="login-container">
                <form className="form-signin text-center" onSubmit={handleSubmit} id="form-signin">
                    <div className="login-form" id="form-container">
                        <div id="form-child">
                            <h2 className="form-heading">User Login</h2>
                            <div className="mb-4">
                                <div className="form-group form-group-1">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="text"
                                        name="email"
                                        id="email"
                                        className="form-control"
                                        placeholder="Enter your email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="form-group form-group-2">
                                    <label htmlFor="inputPassword">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        className="form-control"
                                        placeholder="Enter your password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            {loginError && (
                                <div className="alert alert-danger" id="login-error">
                                    <i className="fas fa-exclamation-circle"></i> {loginError}
                                </div>
                            )}

                            <button className="btn btn-outline-light btn-lg btn-block form-group-3" type="submit">
                                Log in
                            </button>
                            <br />
                            <p className="link">
                                <a href="Register">
                                    <center>Don't have an account? Sign Up here</center>
                                </a>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
