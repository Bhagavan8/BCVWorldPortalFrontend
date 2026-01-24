import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from '../admin/components/DashboardLayout';
// Import admin specific styles
import '../admin/assets/css/index.css';
import '../admin/assets/css/style.css'; 

const AdminLayout = () => {
  useEffect(() => {
    // Lazy load Bootstrap CSS for Admin Panel
    import('bootstrap/dist/css/bootstrap.min.css');
  }, []);

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminLayout;