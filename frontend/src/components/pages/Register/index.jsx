import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', formData);

      if (response.status === 201) {
        alert('Registration successful');
        navigate('/login');  // Redirect to login page
      }
    } catch (error) {
      console.error("Registration Error: ", error.response ? error.response.data : error.message);
  alert(error.response ? error.response.data.message : 'Registration failed');
    }
  };

  return (
    <div className="background-image4">
      <div className="register">
        <div className="register-container">
          <form onSubmit={handleSubmit}>
            <h1 className="form-header" data-component="header">Register Form</h1>
            <div className="form-group">
              <label htmlFor="full_name">Full Name</label>
              <input
                type="text"
                className="form-control"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>
            <br />
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
