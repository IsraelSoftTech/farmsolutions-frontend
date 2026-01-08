import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to admin home
    navigate('/admin/home', { replace: true });
  }, [navigate]);

  return null;
};

export default Admin;
