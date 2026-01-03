import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from '../admin/components/DashboardLayout';
// Import Bootstrap for Admin Panel
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
// Import admin specific styles
import '../admin/assets/css/index.css';
import '../admin/assets/css/style.css'; 

const AdminLayout = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminLayout;