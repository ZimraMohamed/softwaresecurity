import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmailVerification = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get('token');

      try {
        const response = await axios.get(`http://localhost:5000/api/verify-email?token=${token}`);
        if (response.status === 200) {
          alert('Email verified successfully. Please log in.');
          navigate('/login');
        } else {
          alert('Email verification failed.');
          navigate('/register');
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        alert('Email verification failed.');
        navigate('/register');
      }
    };

    verifyEmail();
  }, [navigate]);

  return <div>Verifying email...</div>;
};

export default EmailVerification;
