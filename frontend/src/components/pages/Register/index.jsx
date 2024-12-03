import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [passwordValid, setPasswordValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      validatePassword(value); // Validate password as the user types
    }
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!regex.test(password)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must contain at least 8 characters, including uppercase, lowercase, numbers, and symbols."
      }));
      setPasswordValid(false);
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
      setPasswordValid(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;
    const newErrors = {};

    if (!passwordValid) {
      newErrors.password = "Password does not meet the requirements.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post('https://softwaresecurity.vercel.app/register', {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password
      });

      if (response.status === 201) {
        alert('Registration successful');
        navigate('/login'); 
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
              {errors.password && <small className="text-danger">{errors.password}</small>}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
              />
              {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
            </div>
            <br />
            <button type="submit" className="btn btn-primary" disabled={!passwordValid}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
